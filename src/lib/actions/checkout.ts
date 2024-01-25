'use server';

import { db } from '../db';
import * as z from 'zod';
import { actionClient, authorizedActionClient } from './safe-action';
import { AddressFormSchema } from '../validation/address-form';
import { address } from '../db/schema/address';
import { and, eq } from 'drizzle-orm';
import { CustomError } from '../errors/custom-error';
import { createId } from '@paralleldrive/cuid2';
import {
  CartItemsForCheckout,
  calcPricingDetails,
  getCartItemsForCheckout,
} from '../server/checkout';
import { OrderSelect, orders } from '../db/schema/orders';
import { orderDetails } from '../db/schema/orderDetails';
import { orderPaymentDetails } from '../db/schema/orderPaymentDetails';
import { invoice } from '../db/schema/invoice';
import Stripe from 'stripe';
import { stripe } from '../stripe/server-side';
import { ProductSelect } from '../db/schema/products';
import { CartItemsSelect } from '../db/schema/cartItems';
import { ProductEntrySelect } from '../db/schema/productEntries';
import { SizeSelect } from '../db/schema/sizes';

const CheckoutAddressInputSchema = z.object({
  mode: z.literal('input'),
  values: AddressFormSchema,
});
const CheckoutAddressSelectSchema = z.object({
  mode: z.literal('select'),
  addressId: z.number(),
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

export const performCheckoutAction = authorizedActionClient(
  PerformCheckoutSchema,
  async ({ shippingAddress }, { userId, session }): PerformCheckoutReturn => {
    // Handling Cart
    const cartId = session.user.cartId;

    if (!cartId) throw new CustomError('Shopping cart not found!');

    const cartItems = await getCartItemsForCheckout({ cartId });

    if (cartItems.length === 0)
      throw new CustomError('Shopping cart is empty!');

    // Checking if a product entry is unavailable due to low stock quantity
    for (let cartItem of cartItems) {
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

    // Handling Address
    let addressId: number | undefined = undefined;

    if (shippingAddress.mode === 'select') {
      const isAddressIdValid = (
        await db
          .select({ addressId: address.id })
          .from(address)
          .where(
            and(
              eq(address.id, shippingAddress.addressId),
              eq(address.userId, userId),
            ),
          )
      ).at(0);
      if (isAddressIdValid) {
        addressId = shippingAddress.addressId;
      } else {
        throw new CustomError(
          'Selected address was invalid! Please use another option.',
        );
      }
    }

    if (shippingAddress.mode === 'input') {
      const newAddress = await db.transaction(async (tx) => {
        const res = (
          await tx
            .insert(address)
            .values({
              address: shippingAddress.values.address,
              city: shippingAddress.values.city,
              country: shippingAddress.values.country,
              phone: shippingAddress.values.phone,
              type: shippingAddress.values.type,
              label:
                shippingAddress.values.label ??
                `My Address #${createId().slice(0, 3)}`,
              isSaved: false,
              userId,
            })
            .returning()
        ).at(0);

        if (!res) {
          tx.rollback();
          throw new CustomError(
            'Something went wrong with while creating the address entry! Please try again.',
          );
        }

        return res;
      });
      addressId = newAddress.id;
    }

    if (!addressId)
      throw new CustomError(
        'Something went wrong with the billing address! Please try again.',
      );

    // Handling order
    const createdOrder = await db.transaction(async (tx) => {
      try {
        const createdOrder = (
          await tx.insert(orders).values({ userId }).returning()
        ).at(0);

        if (!createdOrder) {
          tx.rollback();
          throw new CustomError();
        }

        const placedAt = new Date();
        const deliveryDate = new Date(placedAt);
        deliveryDate.setDate(placedAt.getDate() + 2);

        const { deliveryCharge, subtotal, taxes, totalDiscount, total } =
          calcPricingDetails(cartItems, true);

        const invoicePromise = tx.insert(invoice).values({
          orderId: createdOrder.id,
          subtotal: subtotal.toString(),
          deliveryCharge: deliveryCharge.toString(),
          totalDiscountInCurrency: totalDiscount.toString(),
          taxes: taxes.toString(),
          createdAt: placedAt,
        });

        const orderDetailsPromise = tx.insert(orderDetails).values({
          addressId: addressId!,
          orderId: createdOrder.id,
          statusId: 1,
          deliveryDate,
          placedAt,
          updatedAt: placedAt,
        });

        await Promise.all([invoicePromise, orderDetailsPromise]);

        return { orderId: createdOrder.id, total };
      } catch (e) {
        throw new CustomError(
          'Something went wrong while creating the order! Please try again.',
        );
      }
    });

    // Handling Payment

    const paymentIntent: Stripe.PaymentIntent =
      await stripe.paymentIntents.create({
        amount: createdOrder.total * 100,
        currency: 'usd',
        automatic_payment_methods: { enabled: true },
        metadata: {
          orderId: createdOrder.orderId,
        },
      });

    return {
      stripeClientSecret: paymentIntent.client_secret,
      orderId: createdOrder.orderId,
      isThereUnavailableProduct: false,
    };
  },
);
