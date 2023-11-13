'use server';
import { db } from '@/lib/db';
import { cartItems } from '@/lib/db/schema/cartItems';
import { carts } from '@/lib/db/schema/carts';
import { productEntries } from '@/lib/db/schema/productEntries';
import { products } from '@/lib/db/schema/products';
import { sizes } from '@/lib/db/schema/sizes';
import { wait } from '@/lib/util';
import { and, eq, gt, sql } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';

export const addProductToCart = async (
  productId: number,
  sizeId: number,
  quantity: number,
) => {
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

  revalidatePath('/cart', 'page');

  return cartItem;
};

export const createCart = async () => {
  const [cart] = await db.insert(carts).values({}).returning();
  return cart?.id;
};

export const deleteCartItem = async (cartItemId: number) => {
  await db.transaction(async (tx) => {
    await tx.delete(cartItems).where(eq(cartItems.id, cartItemId));
  });
  revalidatePath('/cart', 'page');
};

// export const updateCartItemQuantity
