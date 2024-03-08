import 'server-only';

import {
  and,
  count,
  eq,
  ExtractTablesWithRelations,
  isNull,
  or,
  SQL,
  sql,
} from 'drizzle-orm';
import {
  NodePgDatabase,
  NodePgQueryResultHKT,
} from 'drizzle-orm/node-postgres';
import { PgTransaction } from 'drizzle-orm/pg-core';
import { UserInsert } from '@/lib/db/schema/auth2';
import { User } from 'lucia';
import { cookies } from 'next/headers';
import { cache } from 'react';
import { db } from '../db';
import { cartItems } from '../db/schema/cartItems';
import { carts, CartsSelect } from '../db/schema/carts';
import { clothing } from '../db/schema/clothing';
import { productEntries } from '../db/schema/productEntries';
import { productImages } from '../db/schema/productImages';
import { products } from '../db/schema/products';
import { sizes } from '../db/schema/sizes';
import { auth } from './auth';
import { decodeSingleSqid, encodeSingleSqid } from './sqids';

export const createCart = async (
  dbInstance?:
    | PgTransaction<NodePgQueryResultHKT, any, ExtractTablesWithRelations<any>>
    | NodePgDatabase<any>,
  userId?: UserInsert['id'],
) => {
  let dbClient = dbInstance ? dbInstance : db;
  const newCart = await dbClient.insert(carts).values({ userId }).returning();
  return newCart;
};

export const getGuestUserCartId = async (createIfNotFound: boolean = false) => {
  const encodedCartIdFromCookies = cookies().get('cartId')?.value;
  let cartIdFromCookies = encodedCartIdFromCookies
    ? decodeSingleSqid(encodedCartIdFromCookies)
    : undefined;

  if (cartIdFromCookies) {
    const validatedCart = (
      await db
        .select({ userId: carts.userId })
        .from(carts)
        .where(eq(carts.id, cartIdFromCookies))
    ).at(0);

    if (!validatedCart || validatedCart.userId) {
      cartIdFromCookies = undefined;
      cookies().delete('cartId');
    } else {
      return cartIdFromCookies;
    }
  }

  if (!cartIdFromCookies && createIfNotFound) {
    const createdCartId = (await createCart()).at(0)?.id;

    if (createdCartId) {
      cookies().set('cartId', encodeSingleSqid(createdCartId));
      return createdCartId;
    }
  }
};

export const getCartId = cache(async (): Promise<CartsSelect['id'] | null> => {
  const authObject = await auth();

  if (authObject.user) {
    const cartId = await db
      .select({ cartId: carts.id })
      .from(carts)
      .where(eq(carts.userId, authObject.user.id))
      .then((res) => res.at(0));

    if (cartId) {
      return cartId.cartId;
    }
  }

  if (!authObject.user) {
    const encodedCartIdFromCookies = cookies().get('cartId')?.value;
    const cartIdFromCookies = encodedCartIdFromCookies
      ? decodeSingleSqid(encodedCartIdFromCookies)
      : null;

    if (cartIdFromCookies) {
      const validatedCookiesCart = await db
        .select()
        .from(carts)
        .where(and(eq(carts.id, cartIdFromCookies), isNull(carts.userId)))
        .then((res) => res.at(0));

      if (!validatedCookiesCart) {
        return null;
      }

      return cartIdFromCookies;
    }
  }

  return null;
});

export const handleCartOnSignIn = async (userId: User['id']) => {
  const encodedCartIdFromCookies = cookies().get('cartId')?.value;
  const cartIdFromCookies = encodedCartIdFromCookies
    ? decodeSingleSqid(encodedCartIdFromCookies)
    : null;

  let shouldCreateNewCart = false;

  if (cartIdFromCookies) {
    const validatedCartResults = await db
      .select({ cartId: carts.id, userId: carts.userId })
      .from(carts)
      .where(or(eq(carts.userId, userId), eq(carts.id, cartIdFromCookies)));

    const validatedCookieCart = validatedCartResults.find(
      (cart) => cart.cartId === cartIdFromCookies,
    );

    const validatedExistingUserCart = validatedCartResults.find(
      (cart) => cart.userId === userId,
    );

    // if cookie cart exists and user does not exist
    if (validatedCookieCart && !validatedExistingUserCart) {
      await db.transaction(async (tx) => {
        await tx
          .update(carts)
          .set({ userId: userId })
          .where(eq(carts.id, validatedCookieCart.cartId));
      });
    }
    // if cookie cart doesnt exist and user does exist
    if (!validatedCookieCart && validatedExistingUserCart) {
      // do nothing
    }

    // if cookie cart and user cart exists, and cookie cart is not from any user or its not the same as current users cartid
    if (
      validatedCookieCart &&
      validatedExistingUserCart &&
      !validatedCookieCart.userId &&
      validatedCookieCart.cartId !== validatedExistingUserCart.cartId
    ) {
      const cookieCartCount = await db
        .select({ count: count() })
        .from(cartItems)
        .where(eq(cartItems.cartId, validatedCookieCart.cartId))
        .then((res) => res.at(0));

      // if the local cookie cart has some items
      if (cookieCartCount && cookieCartCount.count > 0) {
        await db.transaction(async (tx) => {
          const promises: Promise<unknown>[] = [];

          promises.push(
            tx
              .delete(carts)
              .where(eq(carts.id, validatedExistingUserCart.cartId)),
          );
          promises.push(
            tx
              .update(carts)
              .set({ userId: userId })
              .where(eq(carts.id, validatedCookieCart.cartId)),
          );

          await Promise.all(promises);
        });
      }
    }

    if (!validatedCookieCart && !validatedExistingUserCart) {
      shouldCreateNewCart = true;
    }
  }

  if (!cartIdFromCookies) {
    const existingUserCart = await db
      .select({ cartId: carts.id, userId: carts.userId })
      .from(carts)
      .where(eq(carts.userId, userId))
      .then((res) => res.at(0));

    if (!existingUserCart) {
      shouldCreateNewCart = true;
    }
  }

  if (shouldCreateNewCart) {
    await db.transaction(async (tx) => {
      await tx.insert(carts).values({ userId: userId });
    });
  }

  if (cookies().has('cartId')) cookies().delete('cartId');
};

export const getCartItems = async ({
  cartId,
}: {
  cartId: CartsSelect['id'];
}) => {
  let conditionals: SQL[] = [
    eq(cartItems.cartId, cartId),
    eq(productImages.isDefault, true),
  ];

  let query = db
    .selectDistinct({
      productId: products.id,
      name: products.name,
      price: products.price,
      clothing: clothing.name,
      sizeName: sizes.name,
      image: productImages.url,
      cartItemId: cartItems.id,
      quantity: cartItems.quantity,
      createdAt: cartItems.createdAt,
    })
    .from(cartItems)
    .innerJoin(productEntries, eq(productEntries.id, cartItems.productEntryId))
    .innerJoin(products, eq(products.id, productEntries.productID))
    .innerJoin(clothing, eq(products.clothingID, clothing.id))
    .innerJoin(sizes, eq(sizes.id, productEntries.sizeID))
    .leftJoin(productImages, eq(products.id, productImages.productID))
    .$dynamic();

  query = query
    .where(and(...conditionals))
    .orderBy(sql`${cartItems.createdAt} DESC, ${cartItems.id} DESC`);

  const cartItemsData = (await query).map((cartItem) => ({
    ...cartItem,
    cartItemId: encodeSingleSqid(cartItem.cartItemId),
  }));

  return cartItemsData;
};

export type FetchedCartItem = Awaited<ReturnType<typeof getCartItems>>[number];

export const fetchCartItemsFromServerComp = cache(async () => {
  const cartId = await getCartId();
  if (!cartId) return;

  const cartItemsData = await getCartItems({
    cartId,
  });

  return cartItemsData;
});
