import { publicProcedure, router } from './trpc';
import { z } from 'zod';
import { db } from '@/lib/db';
import { cartItems } from '@/lib/db/schema/cartItems';
import { eq } from 'drizzle-orm';
import { cookies } from 'next/headers';
import { CartItemProps } from '@/lib/types/cart';
import { products } from '@/lib/db/schema/products';
import { sizes } from '@/lib/db/schema/sizes';
import { productEntries } from '@/lib/db/schema/productEntries';

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
        updatedAt: cartItems.updatedAt,
      })
      .from(cartItems)
      .innerJoin(
        productEntries,
        eq(productEntries.id, cartItems.productEntryId),
      )
      .innerJoin(products, eq(products.id, productEntries.productID))
      .innerJoin(sizes, eq(sizes.id, productEntries.sizeID))
      .where(eq(cartItems.cartId, cartId))
      .orderBy(products.name);

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
});

export type AppRouter = typeof appRouter;
