import 'server-only';

import { dedupedAuth } from '@/auth';
import {
  and,
  eq,
  ExtractTablesWithRelations,
  isNull,
  SQL,
  sql,
} from 'drizzle-orm';
import {
  NodePgDatabase,
  NodePgQueryResultHKT,
} from 'drizzle-orm/node-postgres';
import { PgTransaction } from 'drizzle-orm/pg-core';
import { Session } from 'next-auth';
import { User } from 'next-auth/types';
import { cookies } from 'next/headers';
import { cache } from 'react';
import { db } from '../db';
import { UserInsert, user as userTable } from '../db/schema/auth';
import { cartItems, CartItemsSelect } from '../db/schema/cartItems';
import { carts, CartsSelect } from '../db/schema/carts';
import { productEntries } from '../db/schema/productEntries';
import { products, ProductSelect } from '../db/schema/products';
import { sizes, SizeSelect } from '../db/schema/sizes';
import { decodeSingleSqid, encodeSingleSqid } from './sqids';
import { productImages } from '../db/schema/productImages';
import { clothing } from '../db/schema/clothing';

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

export const getCartId = async (
  session?: Session | null,
  createIfNotFound: boolean = false,
) => {
  const authSession = session !== undefined ? session : await dedupedAuth();

  let cartId = authSession?.user.cartId
    ? decodeSingleSqid(authSession.user.cartId)
    : undefined;

  if (cartId) return cartId;

  cartId = await getGuestUserCartId(createIfNotFound);

  return cartId;
};

export const handleCartOnSignIn = async (user: User) => {
  const encodedCartIdFromCookies = cookies().get('cartId')?.value;
  let cartIdFromCookies = encodedCartIdFromCookies
    ? decodeSingleSqid(encodedCartIdFromCookies)
    : undefined;

  await db.transaction(async (tx) => {
    let userCartId: number | undefined = undefined;
    const userCartIdDbCall = tx
      .select({ cartId: carts.id })
      .from(carts)
      .innerJoin(userTable, eq(userTable.id, carts.userId))
      .where(eq(userTable.id, user.id));

    if (cartIdFromCookies) {
      const validateCookieCartDbCall = tx
        .select()
        .from(carts)
        .where(eq(carts.id, cartIdFromCookies));

      const [userCartIdData, validatedCartIdFromCookiesData] =
        await Promise.all([userCartIdDbCall, validateCookieCartDbCall]);
      if (userCartIdData) {
        userCartId = userCartIdData.at(0)?.cartId;
      }
      if (validatedCartIdFromCookiesData) {
        const validatedCookieCart = validatedCartIdFromCookiesData.at(0);
        if (!validatedCookieCart) {
          cartIdFromCookies = undefined;
        }
        if (
          validatedCookieCart?.userId &&
          validatedCookieCart.userId !== user.id
        ) {
          cartIdFromCookies = undefined;
        }
      }
    } else {
      userCartId = (await userCartIdDbCall)?.at(0)?.cartId;
    }

    if (userCartId && userCartId === cartIdFromCookies) {
      cookies().delete('cartId');
      tx.rollback();
      return;
    }

    if (cartIdFromCookies && userCartId !== cartIdFromCookies) {
      const cookieCartItemsLength = (
        await tx
          .select()
          .from(cartItems)
          .where(eq(cartItems.cartId, cartIdFromCookies))
      ).length;

      if (cookieCartItemsLength > 0) {
        if (userCartId) await tx.delete(carts).where(eq(carts.id, userCartId));
      }
      await tx
        .update(carts)
        .set({ userId: user.id })
        .where(eq(carts.id, cartIdFromCookies));
    }

    if (!cartIdFromCookies && !userCartId) {
      await tx.insert(carts).values({ userId: user.id });
    }

    if (cookies().has('cartId')) cookies().delete('cartId');
  });
};

export const getCartItems = async ({
  cartId,
  isGuestFetcher,
}: {
  cartId: CartsSelect['id'];
  isGuestFetcher?: boolean;
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

  if (isGuestFetcher) {
    query = query.innerJoin(carts, eq(carts.id, cartItems.cartId));
    conditionals.push(isNull(carts.userId));
  }

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
  const session = await dedupedAuth();
  const cartId = await getCartId(session, true);
  if (!cartId) return;

  const cartItemsData = await getCartItems({
    cartId,
    isGuestFetcher: !session,
  });

  return cartItemsData;
});
