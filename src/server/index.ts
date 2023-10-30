import { publicProcedure, router } from './trpc';
import { z } from 'zod';
import { db } from '@/lib/db';
import { CartItemsInsert, cartItems } from '@/lib/db/schema/cartItems';
import { desc, eq, gte, sql } from 'drizzle-orm';
import { cookies } from 'next/headers';
import { CartItemProps } from '@/lib/types/cart';
import { products } from '@/lib/db/schema/products';
import { sizes } from '@/lib/db/schema/sizes';
import { productEntries } from '@/lib/db/schema/productEntries';
import { genRandomInt } from '@/lib/util';
import { carts } from '@/lib/db/schema/carts';

export const appRouter = router({
  getCartItems: publicProcedure.query(async () => {
    const cartId = Number(cookies().get('cartId')?.value);

    if (Number.isNaN(cartId)) return undefined;

    const cartItemsData: CartItemProps[] = await db
      .select({
        name: products.name,
        price: products.price,
        sizeName: sizes.name,
        cartItemId: cartItems.id,
        quantity: cartItems.quantity,
        createdAt: cartItems.createdAt,
      })
      .from(cartItems)
      .innerJoin(
        productEntries,
        eq(productEntries.id, cartItems.productEntryId),
      )
      .innerJoin(products, eq(products.id, productEntries.productID))
      .innerJoin(sizes, eq(sizes.id, productEntries.sizeID))
      .where(eq(cartItems.cartId, cartId))
      .orderBy(sql`${cartItems.createdAt} DESC, ${cartItems.id} DESC`);

    return cartItemsData;
  }),
  updateCartQuantity: publicProcedure
    .input(
      z.object({
        cartItemId: z.number(),
        newQuantity: z.number(),
      }),
    )
    .mutation(async (options) => {
      const updated = await db.transaction(async (tx) => {
        const [res] = await tx
          .update(cartItems)
          .set({
            quantity: options.input.newQuantity,
            updatedAt: new Date(),
          })
          .where(eq(cartItems.id, options.input.cartItemId))
          .returning();
        return res;
      });
      return updated;
    }),
  deleteCartItem: publicProcedure
    .input(
      z.object({
        cartItemId: z.number(),
      }),
    )
    .mutation(async (options) => {
      const deleted = await db.transaction(async (tx) => {
        return await tx
          .delete(cartItems)
          .where(eq(cartItems.id, options.input.cartItemId));
      });
      return deleted;
    }),
  generateCartItems: publicProcedure
    .input(z.number())
    .mutation(async (options) => {
      let cartId: number | undefined = Number(cookies().get('cartId')?.value);

      if (!cartId) {
        let [cart] = await db.insert(carts).values({}).returning();
        cartId = cart?.id;
      }

      if (cartId === undefined) {
        return;
      } else {
        cookies().set('cartId', cartId.toString());
      }

      const productEntryIds = await db
        .select({ id: productEntries.id })
        .from(productEntries)
        .where(gte(productEntries.quantity, 10));

      const generatedCartItems: CartItemsInsert[] = [
        ...Array(options.input).keys(),
      ].map(() => ({
        cartId: cartId!,
        productEntryId: productEntryIds.at(
          genRandomInt(0, productEntryIds.length - 1),
        )!.id!,
        quantity: genRandomInt(1, 10),
      }));

      return await db.transaction(async (tx) => {
        return await tx.insert(cartItems).values(generatedCartItems);
      });
    }),
  clearCartItems: publicProcedure.mutation(async () => {
    const cartId = Number(cookies().get('cartId')?.value);

    if (Number.isNaN(cartId)) return undefined;

    return await db.transaction(async (tx) => {
      return await tx.delete(cartItems).where(eq(cartItems.cartId, cartId));
    });
  }),
});

export type AppRouter = typeof appRouter;
