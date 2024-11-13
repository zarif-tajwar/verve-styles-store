'use server';

import { rand, randAddress, randPhoneNumber, randText } from '@ngneat/falso';
import { createId } from '@paralleldrive/cuid2';
import { SQL, and, eq, inArray, sql } from 'drizzle-orm';
import { QueryBuilder } from 'drizzle-orm/pg-core';
import { User } from 'lucia';
import { revalidatePath } from 'next/cache';
import Stripe from 'stripe';
import * as z from 'zod';
import { db } from '../db';
import { address } from '../db/schema/address';
import { CartItemsSelect, cartItems } from '../db/schema/cartItems';
import { invoice } from '../db/schema/invoice';
import {
  OrderCustomerAddressDetailsInsert,
  orderCustomerDetails,
} from '../db/schema/orderCustomerDetails';
import { orderDetails } from '../db/schema/orderDetails';
import { OrderLinesInsert, orderLine } from '../db/schema/orderLine';
import { orderPaymentDetails } from '../db/schema/orderPaymentDetails';
import { OrderSelect, orders } from '../db/schema/orders';
import {
  ProductEntrySelect,
  productEntries,
} from '../db/schema/productEntries';
import { CustomError } from '../errors/custom-error';
import {
  calcPricingDetails,
  getCartItemsForCheckout,
} from '../server/checkout';
import { decodeSingleSqid } from '../server/sqids';
import { stripe } from '../stripe/server-side';
import { AddressFormSchema } from '../validation/address-form';
import { authorizedActionClient } from './safe-action';

const CheckoutAddressInputSchema = z.object({
  mode: z.literal('input'),
  values: AddressFormSchema,
});
const CheckoutAddressSelectSchema = z.object({
  mode: z.literal('select'),
  addressId: z.string(),
});

const PerformCheckoutSchema = z.object({
  shippingAddress: z.discriminatedUnion('mode', [
    CheckoutAddressInputSchema,
    CheckoutAddressSelectSchema,
  ]),
});

export type PerformCheckoutSchemaType = z.infer<typeof PerformCheckoutSchema>;

type PerformCheckoutReturn = Promise<
  | {
      stripeClientSecret: Stripe.PaymentIntent['client_secret'] | undefined;
      orderId: OrderSelect['id'] | undefined;
      isThereUnavailableProduct: boolean;
    }
  | undefined
>;

const checkoutCommonAction = async ({
  values: { shippingAddress },
  user,
}: {
  values: PerformCheckoutSchemaType;
  user: User;
}) => {
  // Handling Cart

  const orderedCartItems = await getCartItemsForCheckout({ userId: user.id });

  if (orderedCartItems.length === 0)
    throw new CustomError('Shopping cart is empty!');

  // Checking if a product entry is unavailable due to low stock quantity
  for (let cartItem of orderedCartItems) {
    if (
      cartItem.stockQuantity === 0 ||
      cartItem.stockQuantity - cartItem.quantity < 0
    ) {
      return {
        isThereUnavailableProduct: true,
        orderId: undefined,
        stripeClientSecret: undefined,
      };
    }
  }

  // Handling Address Insert Data
  let addressInsertData: OrderCustomerAddressDetailsInsert | undefined;

  if (shippingAddress.mode === 'select') {
    const savedAddress = (
      await db
        .select()
        .from(address)
        .where(
          and(
            eq(address.id, decodeSingleSqid(shippingAddress.addressId)),
            eq(address.userId, user.id),
          ),
        )
    ).at(0);
    if (savedAddress) {
      addressInsertData = {
        ...savedAddress,
        addressLabel: savedAddress.label,
        addressType: savedAddress.type,
      };
    } else {
      throw new CustomError(
        'Selected address was invalid! Please use another option.',
      );
    }
  }

  if (shippingAddress.mode === 'input') {
    addressInsertData = {
      address: shippingAddress.values.address,
      addressLabel:
        shippingAddress.values.label ?? `My Address #${createId().slice(0, 3)}`,
      city: shippingAddress.values.city,
      country: shippingAddress.values.country,
      phone: shippingAddress.values.phone,
      addressType: shippingAddress.values.type,
    };
  }

  if (!addressInsertData)
    throw new CustomError(
      'Something went wrong with the billing address! Please try again.',
    );

  // Handling order
  const createdOrder = await db.transaction(async (tx) => {
    try {
      const createdOrder = (
        await tx.insert(orders).values({ userId: user.id }).returning()
      ).at(0);

      if (!createdOrder) {
        tx.rollback();
        throw new CustomError();
      }

      const placedAt = new Date();
      const deliveryDate = new Date(placedAt);
      deliveryDate.setDate(placedAt.getDate() + 2);

      const { deliveryCharge, subtotal, taxes, totalDiscount, total } =
        calcPricingDetails(orderedCartItems, true);

      const invoicePromise = tx.insert(invoice).values({
        orderId: createdOrder.id,
        subtotal: subtotal.toString(),
        deliveryCharge: deliveryCharge.toString(),
        totalDiscountInCurrency: totalDiscount.toString(),
        taxes: taxes.toString(),
        createdAt: placedAt,
      });

      const orderDetailsPromise = tx.insert(orderDetails).values({
        orderId: createdOrder.id,
        statusId: 1,
        deliveryDate,
        placedAt,
        updatedAt: placedAt,
      });

      const orderCustomerDetailsPromise = tx
        .insert(orderCustomerDetails)
        .values({
          ...addressInsertData!,
          orderId: createdOrder.id,
          customerEmail: user.email,
          customerName: user.name,
        });

      // updating stock quantity and creating orderLine
      const qb = new QueryBuilder();
      const stockSqlChunks: SQL[] = [];
      const productEntryIds: ProductEntrySelect['id'][] = [];
      const cartItemIds: CartItemsSelect['id'][] = [];
      const orderLinesData: OrderLinesInsert[] = [];

      // for update query multiple mutations
      stockSqlChunks.push(sql`(case`);
      for (const cartItem of orderedCartItems) {
        // orderline data
        orderLinesData.push({
          orderId: createdOrder.id,
          pricePerUnit: cartItem.price,
          productEntryId: cartItem.productEntryId,
          quantity: cartItem.quantity,
          discount: cartItem.discount,
          createdAt: placedAt,
        });
        // for updating stock quantity
        productEntryIds.push(cartItem.productEntryId);
        cartItemIds.push(cartItem.cartItemId);
        stockSqlChunks.push(
          sql`when ${productEntries.id} = ${cartItem.productEntryId} then (${qb
            .select({
              newQuantity: sql<number>`${productEntries.quantity} - ${cartItem.quantity}`,
            })
            .from(productEntries)
            .where(eq(productEntries.id, cartItem.productEntryId))})`,
        );
      }
      stockSqlChunks.push(sql`end)`);
      const finalStockUpdateSql = sql.join(stockSqlChunks, sql.raw(' '));

      const orderLinesPromise = tx.insert(orderLine).values(orderLinesData);
      const stockUpdatePromise = tx
        .update(productEntries)
        .set({ quantity: finalStockUpdateSql })
        .where(inArray(productEntries.id, productEntryIds));
      const cleanCartPromise = tx
        .delete(cartItems)
        .where(inArray(cartItems.id, cartItemIds));

      await Promise.all([
        invoicePromise,
        orderDetailsPromise,
        orderLinesPromise,
        stockUpdatePromise,
        cleanCartPromise,
        orderCustomerDetailsPromise,
      ]);

      return {
        total,
        orderId: createdOrder.id,
      };
    } catch (error) {
      throw new CustomError(
        error instanceof CustomError
          ? error.message
          : 'Something went wrong while creating the order! Please try again.',
      );
    }
  });

  return createdOrder;
};

export const performDummyCheckout = authorizedActionClient(
  z.object({}),
  async ({}, user) => {
    const fakeAddress = randAddress();

    const values: PerformCheckoutSchemaType = {
      shippingAddress: {
        mode: 'input',
        values: {
          address: fakeAddress.street,
          city: fakeAddress.city,
          country: fakeAddress.country!,
          label: randText({ charCount: 10 }),
          phone: randPhoneNumber({ countryCode: 'UK' }),
          type: rand(['home', 'not-relevant', 'office']),
        },
      },
    };
    const orderData = await checkoutCommonAction({
      values,
      user,
    });

    if (!orderData.orderId) return orderData;

    const date = new Date();

    await db.transaction(async (tx) => {
      const orderDetailsPromise = tx
        .update(orderDetails)
        .set({ statusId: 2, updatedAt: date })
        .where(eq(orderDetails.orderId, orderData.orderId));
      const createdPaymentDetailsPromise = tx
        .insert(orderPaymentDetails)
        .values({
          orderId: orderData.orderId,
          paymentMethod: 'dummy',
        })
        .returning();

      await Promise.all([orderDetailsPromise, createdPaymentDetailsPromise]);
    });

    return orderData;
  },
);

export const performCheckoutAction = authorizedActionClient(
  PerformCheckoutSchema,
  async (values, user): PerformCheckoutReturn => {
    const orderData = await checkoutCommonAction({ values, user });

    if (!(orderData.orderId && orderData.total)) {
      return;
    }

    // Handling Payment
    const paymentIntent: Stripe.PaymentIntent = await stripe.paymentIntents
      .create({
        amount: orderData.total * 100,
        currency: 'usd',
        automatic_payment_methods: { enabled: true },
        metadata: {
          orderId: orderData.orderId,
        },
      })
      .catch(() => {
        throw new CustomError('Something went wrong with Stripe Payment');
      });

    if (!paymentIntent.client_secret) {
      throw new CustomError('Something went wrong with Stripe Payment');
    }

    return {
      stripeClientSecret: paymentIntent.client_secret,
      orderId: orderData.orderId,
      isThereUnavailableProduct: false,
    };
  },
);

const CreateOrderPaymentDetailsSchema = z.object({
  orderId: z.number(),
  paymentMethod: z.enum(['stripe', 'dummy']),
  paymentMethodSessionId: z.string(),
});

export const createOrderPaymentDetails = authorizedActionClient(
  CreateOrderPaymentDetailsSchema,
  async ({ orderId, paymentMethod, paymentMethodSessionId }, user) => {
    const res = await db.transaction(async (tx) => {
      try {
        const isAllowed = (
          await tx
            .select({ orderId: orders.id })
            .from(orders)
            .where(and(eq(orders.userId, user.id), eq(orders.id, orderId)))
        ).at(0);
        if (!isAllowed) {
          throw new CustomError();
        }

        const createdPaymentDetails = await tx
          .insert(orderPaymentDetails)
          .values({ orderId, paymentMethod, paymentMethodSessionId })
          .returning();

        return createdPaymentDetails;
      } catch (err) {
        throw new CustomError(
          'Something went wrong while creating the payment details! Please contact support!',
        );
      }
    });
    return res;
  },
);

export const revalidatePathAction = async (href: string) => {
  revalidatePath(href);
};
