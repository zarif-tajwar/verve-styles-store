'use server';

import { cookies } from 'next/headers';
import { db } from '../db';
import { products } from '../db/schema/products';
import { sizes } from '../db/schema/sizes';
import {
  cartItems,
  CartItemsInsert,
  CartItemsSelect,
} from '../db/schema/cartItems';
import {
  productEntries,
  ProductEntryInsert,
} from '../db/schema/productEntries';
import { and, eq, gt, sql } from 'drizzle-orm';
import { carts } from '../db/schema/carts';

export const getCartItemsServer = async () => {
  const cartId = Number(cookies().get('cartId')?.value);

  if (Number.isNaN(cartId)) return undefined;

  const cartItemsData = await db
    .select({
      name: products.name,
      price: products.price,
      sizeName: sizes.name,
      cartItemId: cartItems.id,
      quantity: cartItems.quantity,
      createdAt: cartItems.createdAt,
    })
    .from(cartItems)
    .innerJoin(productEntries, eq(productEntries.id, cartItems.productEntryId))
    .innerJoin(products, eq(products.id, productEntries.productID))
    .innerJoin(sizes, eq(sizes.id, productEntries.sizeID))
    .where(eq(cartItems.cartId, cartId))
    .orderBy(sql`${cartItems.createdAt} DESC, ${cartItems.id} DESC`);

  return cartItemsData;
};

export const deleteCartItemServer = async (
  cartItemId: CartItemsSelect['id'],
) => {
  const deleted = await db.transaction(async (tx) => {
    return await tx
      .delete(cartItems)
      .where(eq(cartItems.id, cartItemId))
      .returning();
  });
  return deleted;
};

export const updateCartItemQuantityServer = async ({
  cartItemId,
  newQuantity,
}: {
  cartItemId: CartItemsSelect['id'];
  newQuantity: CartItemsInsert['quantity'];
}) => {
  const updated = await db.transaction(async (tx) => {
    const [res] = await tx
      .update(cartItems)
      .set({
        quantity: newQuantity,
        updatedAt: new Date(),
      })
      .where(eq(cartItems.id, cartItemId))
      .returning();
    return res;
  });
  return updated;
};

export const addCartItemServer = async ({
  productId,
  sizeId,
  quantity,
}: {
  productId: ProductEntryInsert['productID'];
  sizeId: ProductEntryInsert['sizeID'];
  quantity: CartItemsInsert['quantity'];
}) => {
  let cartId: number | undefined = Number(cookies().get('cartId')?.value);

  const cartItem = await db.transaction(async (tx) => {
    if (!cartId) {
      let [cart] = await tx.insert(carts).values({}).returning();
      cartId = cart?.id;
    }

    if (cartId === undefined) {
      tx.rollback();
      return;
    } else {
      cookies().set('cartId', cartId.toString());
    }

    const [product] = await tx
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
      );

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
