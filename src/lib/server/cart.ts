import 'server-only';

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
import { and, eq, ExtractTablesWithRelations, gt, gte, sql } from 'drizzle-orm';
import { carts } from '../db/schema/carts';
import { genRandomInt, parseIntWithUndefined } from '../util';
import { auth } from '@/auth';
import { PgTransaction } from 'drizzle-orm/pg-core';
import {
  NodePgDatabase,
  NodePgQueryResultHKT,
} from 'drizzle-orm/node-postgres';
import { UserInsert, user as userTable } from '../db/schema/auth';
import { Session } from 'next-auth';
import { User } from 'next-auth/types';

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
  let cartIdFromCookies = parseIntWithUndefined(
    cookies().get('cartId')?.value || '',
  );

  if (cartIdFromCookies) {
    const validatedCart = (
      await db.select().from(carts).where(eq(carts.id, cartIdFromCookies))
    ).at(0);

    if (!validatedCart || validatedCart.userId) {
      cartIdFromCookies = undefined;
      cookies().delete('cartId');
    }
  }

  if (!cartIdFromCookies && createIfNotFound) {
    cartIdFromCookies = (await createCart()).at(0)?.id;

    if (cartIdFromCookies)
      cookies().set('cartId', cartIdFromCookies.toString());
  }

  return cartIdFromCookies;
};

export const getCartId = async (
  session?: Session,
  createIfNotFound: boolean = false,
) => {
  const authSession = session ? session : await auth();

  let cartId = authSession?.user.cartId;

  if (cartId) return cartId;

  cartId = await getGuestUserCartId(createIfNotFound);

  return cartId;
};

export const handleCartOnSignIn = async (user: User) => {
  let cartIdFromCookies = parseIntWithUndefined(
    cookies().get('cartId')?.value || '',
  );
  await db.transaction(async (tx) => {
    let userCartId: number | undefined = undefined;
    const userCartIdDbCall = tx
      .select({ cartId: carts.id })
      .from(carts)
      .innerJoin(userTable, eq(userTable.id, carts.userId))
      .where(eq(userTable.id, user.id));

    if (cartIdFromCookies) {
      const validateCookieCart = tx
        .select()
        .from(carts)
        .where(eq(carts.id, cartIdFromCookies));

      const res = await Promise.allSettled([
        userCartIdDbCall,
        validateCookieCart,
      ]);
      if (res[0].status === 'fulfilled') {
        userCartId = res[0].value?.at(0)?.cartId;
      }
      if (res[1].status === 'fulfilled') {
        const validatedCookieCart = res[1].value?.at(0);
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
      if (userCartId) await tx.delete(carts).where(eq(carts.id, userCartId));

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
