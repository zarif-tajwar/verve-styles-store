import 'server-only';

import { and, eq, sql } from 'drizzle-orm';
import { DELIVERY_CHARGE } from '../constants/dummy-values';
import { db } from '../db';
import { cartItems } from '../db/schema/cartItems';
import { InvoiceSelect } from '../db/schema/invoice';
import { productEntries } from '../db/schema/productEntries';
import { products } from '../db/schema/products';
import { sizes } from '../db/schema/sizes';
import { productImages } from '../db/schema/productImages';
import { carts } from '../db/schema/carts';
import { user } from '../db/schema/auth2';
import { User } from 'lucia';

export const getCartItemsForCheckout = async ({
  userId,
  sort,
}: {
  userId: User['id'];
  sort?: boolean;
}) => {
  let query = db
    .selectDistinctOn([productEntries.id], {
      name: products.name,
      price: products.price,
      sizeName: sizes.name,
      cartItemId: cartItems.id,
      image: productImages.url,
      quantity: cartItems.quantity,
      createdAt: cartItems.createdAt,
      discount: products.discount,
      productEntryId: productEntries.id,
      stockQuantity: productEntries.quantity,
    })
    .from(cartItems)
    .innerJoin(carts, eq(carts.id, cartItems.cartId))
    .innerJoin(user, eq(user.id, carts.userId))
    .innerJoin(productEntries, eq(productEntries.id, cartItems.productEntryId))
    .innerJoin(products, eq(products.id, productEntries.productID))
    .innerJoin(sizes, eq(sizes.id, productEntries.sizeID))
    .leftJoin(productImages, eq(productImages.productID, products.id))
    .where(and(eq(carts.userId, userId), eq(productImages.isDefault, true)))
    .$dynamic();
  if (sort) {
    query = query.orderBy(
      sql`${productEntries.id} DESC, ${cartItems.createdAt} DESC`,
    );
  }

  const cartItemsData = await query;

  return cartItemsData;
};

export type CartItemsForCheckout = Awaited<
  ReturnType<typeof getCartItemsForCheckout>
>;

export const calcPricingDetails = (
  cartItems: NonNullable<CartItemsForCheckout>,
  outputInString: boolean = false,
) => {
  let subtotal: number = 0;
  let totalDiscount: number = 0;

  for (let cartItem of cartItems) {
    const itemSubtotal = Number.parseFloat(cartItem.price) * cartItem.quantity;
    const discount = itemSubtotal * Number.parseFloat(cartItem.discount ?? '0');
    totalDiscount += discount;
    subtotal += itemSubtotal;
  }
  let deliveryCharge: number = DELIVERY_CHARGE;
  let taxes: number = 0;

  const total = subtotal + deliveryCharge + taxes - totalDiscount;

  return { subtotal, total, deliveryCharge, totalDiscount, taxes };
};

export const calcTotalFromInvoiceData = (data: InvoiceSelect) =>
  Number.parseFloat(data.subtotal) +
  Number.parseFloat(data.taxes ?? '0') +
  Number.parseFloat(data.deliveryCharge) -
  Number.parseFloat(data.totalDiscountInCurrency ?? '0');

// export const calc;
