import 'server-only';

import { Session } from 'next-auth/types';
import { getCartId } from './cart';
import { db } from '../db';
import { products } from '../db/schema/products';
import { sizes } from '../db/schema/sizes';
import { cartItems } from '../db/schema/cartItems';
import { productEntries } from '../db/schema/productEntries';
import { eq, sql } from 'drizzle-orm';

export const getCartItemsForCheckout = async (session?: Session) => {
  const cartId = await getCartId(session);

  if (!cartId) return;

  const cartItemsData = await db
    .select({
      name: products.name,
      price: products.price,
      sizeName: sizes.name,
      cartItemId: cartItems.id,
      quantity: cartItems.quantity,
      createdAt: cartItems.createdAt,
      discount: products.discount,
    })
    .from(cartItems)
    .innerJoin(productEntries, eq(productEntries.id, cartItems.productEntryId))
    .innerJoin(products, eq(products.id, productEntries.productID))
    .innerJoin(sizes, eq(sizes.id, productEntries.sizeID))
    .where(eq(cartItems.cartId, cartId))
    .orderBy(sql`${cartItems.createdAt} DESC, ${cartItems.id} DESC`);

  return cartItemsData;
};

export type CartItemsForCheckout = Awaited<
  ReturnType<typeof getCartItemsForCheckout>
>;
