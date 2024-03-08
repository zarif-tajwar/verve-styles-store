'use server';

import { and, eq, gt, gte } from 'drizzle-orm';
import { db } from '../db';
import { CartItemsInsert, cartItems } from '../db/schema/cartItems';
import { productEntries } from '../db/schema/productEntries';
import { products } from '../db/schema/products';
import { CustomError } from '../errors/custom-error';
import { createCart, getCartId } from '../server/cart';
import { decodeSingleSqid, encodeSingleSqid } from '../server/sqids';
import { genRandomInt } from '../util';
import {
  AddCartItemSchema,
  DeleteCartItemSchema,
  UpdateCartItemQuantitySchema,
} from '../validation/cart';
import { actionClient } from './safe-action';
import { cookies } from 'next/headers';

export const deleteCartItemAction = actionClient(
  DeleteCartItemSchema,
  async ({ cartItemId }) => {
    const cartId = await getCartId();

    if (!cartId) {
      throw new CustomError('Something went wrong with the cart!');
    }

    const deleted = await db.transaction(async (tx) => {
      return await tx
        .delete(cartItems)
        .where(
          and(
            eq(cartItems.id, decodeSingleSqid(cartItemId)),
            eq(cartItems.cartId, cartId),
          ),
        )
        .returning()
        .then((res) => res.at(0));
    });

    if (!deleted) {
      throw new CustomError('Something went wrong while removing the product');
    }

    return deleted;
  },
);

export const updateCartItemQuantityAction = actionClient(
  UpdateCartItemQuantitySchema,
  async ({
    cartItemId,
    newQuantity,
  }: {
    cartItemId: string;
    newQuantity: CartItemsInsert['quantity'];
  }) => {
    const cartId = await getCartId();

    if (!cartId) {
      throw new CustomError('Something went wrong with the cart!');
    }

    const updated = await db.transaction(async (tx) => {
      const res = await tx
        .update(cartItems)
        .set({
          quantity: newQuantity,
          updatedAt: new Date(),
        })
        .where(
          and(
            eq(cartItems.id, decodeSingleSqid(cartItemId)),
            eq(cartItems.cartId, cartId),
          ),
        )
        .returning()
        .then((res) => res.at(0));
      return res;
    });

    if (!updated) {
      throw new CustomError(
        'Something went wrong while updating the quantity!',
      );
    }

    return updated;
  },
);

export const addCartItemAction = actionClient(
  AddCartItemSchema,
  async ({ productId, sizeId, quantity }) => {
    let cartId = await getCartId();

    if (!cartId) {
      const newCart = await createCart().then((res) => res.at(0));
      if (newCart) {
        cartId = newCart.id;
        cookies().set('cartId', encodeSingleSqid(newCart.id));
      }
    }

    if (!cartId) {
      throw new CustomError('Something went wrong with the cart!');
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
        throw new CustomError(
          'Something went wrong while adding the product to the cart!',
        );
      }

      const insertedCartItem = await tx
        .insert(cartItems)
        .values({
          cartId: cartId!,
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
            eq(cartItems.cartId, cartId!),
            eq(cartItems.productEntryId, product.productEntryId),
          ),
        })
        .returning()
        .then((res) => res.at(0));

      return insertedCartItem;
    });

    return cartItem;
  },
);

export const generateCartItems = async ({ num }: { num: number }) => {
  const cartId = await getCartId();

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
  const cartId = await getCartId();

  if (!cartId) return;

  return await db.transaction(async (tx) => {
    return await tx
      .delete(cartItems)
      .where(eq(cartItems.cartId, cartId))
      .returning();
  });
};
