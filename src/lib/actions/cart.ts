'use server';

import { and, eq, gt, gte } from 'drizzle-orm';
import { db } from '../db';
import { CartItemsInsert, cartItems } from '../db/schema/cartItems';
import {
  ProductEntryInsert,
  productEntries,
} from '../db/schema/productEntries';
import { products } from '../db/schema/products';
import { getCartId } from '../server/cart';
import { decodeSingleSqid } from '../server/sqids';
import { genRandomInt } from '../util';

export const deleteCartItemAction = async (cartItemId: string) => {
  const deleted = await db.transaction(async (tx) => {
    return await tx
      .delete(cartItems)
      .where(eq(cartItems.id, decodeSingleSqid(cartItemId)))
      .returning();
  });
  return deleted;
};

export const updateCartItemQuantityAction = async ({
  cartItemId,
  newQuantity,
}: {
  cartItemId: string;
  newQuantity: CartItemsInsert['quantity'];
}) => {
  const updated = await db.transaction(async (tx) => {
    const [res] = await tx
      .update(cartItems)
      .set({
        quantity: newQuantity,
        updatedAt: new Date(),
      })
      .where(eq(cartItems.id, decodeSingleSqid(cartItemId)))
      .returning();
    return res;
  });
  return updated;
};

export const addCartItemAction = async ({
  productId,
  sizeId,
  quantity,
}: {
  productId: ProductEntryInsert['productID'];
  sizeId: ProductEntryInsert['sizeID'];
  quantity: CartItemsInsert['quantity'];
}) => {
  const cartId = await getCartId(undefined, true);

  if (!cartId) {
    return;
  }

  const cartItem = await db.transaction(async (tx) => {
    const product = (
      await tx
        .selectDistinct({
          name: products.name,
          productEntryId: productEntries.id,
        })
        .from(products)
        .innerJoin(productEntries, eq(productEntries.productID, products.id))
        .where(
          and(
            eq(productEntries.productID, productId),
            eq(productEntries.sizeID, sizeId),
            gt(productEntries.quantity, quantity),
          ),
        )
    ).at(0);

    if (product === undefined) {
      tx.rollback();
      return;
    }

    const insertedCartItem = await tx
      .insert(cartItems)
      .values({
        cartId,
        productEntryId: product.productEntryId,
        quantity,
      })
      .onConflictDoUpdate({
        target: [cartItems.cartId, cartItems.productEntryId],
        set: {
          quantity,
          updatedAt: new Date(),
        },
        where: and(
          eq(cartItems.cartId, cartId),
          eq(cartItems.productEntryId, product.productEntryId),
        ),
      })
      .returning();

    return insertedCartItem;
  });

  return cartItem;
};

export const generateCartItems = async ({ num }: { num: number }) => {
  const cartId = await getCartId(undefined, true);

  if (!cartId) return;

  const productEntryIds = await db
    .select({ id: productEntries.id })
    .from(productEntries)
    .where(gte(productEntries.quantity, 10));

  const generatedCartItems: CartItemsInsert[] = [...Array(num).keys()].map(
    () => ({
      cartId,
      productEntryId: productEntryIds.at(
        genRandomInt(0, productEntryIds.length - 1),
      )!.id!,
      quantity: genRandomInt(1, 10),
    }),
  );

  return await db.transaction(async (tx) => {
    return await tx.insert(cartItems).values(generatedCartItems).returning();
  });
};

export const clearCartItems = async () => {
  const cartId = await getCartId(undefined, true);

  if (!cartId) return;

  return await db.transaction(async (tx) => {
    return await tx
      .delete(cartItems)
      .where(eq(cartItems.cartId, cartId))
      .returning();
  });
};
