'use server';
import { db } from '@/lib/db';
import { cartItems } from '@/lib/db/schema/cartItems';
import { carts } from '@/lib/db/schema/carts';
import { productEntries } from '@/lib/db/schema/productEntries';
import { products } from '@/lib/db/schema/products';
import { and, eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';

export const addProductToCart = async (
  productId: number,
  sizeId: number,
  quantity: number,
) => {
  let cartId = Number.parseInt(cookies().get('cartId')?.value || '0');

  if (!cartId) {
    cartId = (await createCart()) as number;
    cookies().set('cartId', cartId.toString());
  }

  if (!cartId) return;

  const cartItem = await db.transaction(async (tx) => {
    const [product] = await tx
      .selectDistinct({
        name: products.name,
        productEntryId: productEntries.id,
        availableQuantity: productEntries.quantity,
      })
      .from(products)
      .innerJoin(productEntries, eq(productEntries.productID, products.id))
      .where(
        and(
          eq(productEntries.productID, productId),
          eq(productEntries.sizeID, sizeId),
        ),
      );

    if (!product || product.availableQuantity < quantity) {
      tx.rollback();
      return;
    }

    return await tx
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
  });

  revalidatePath('/cart');

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
  revalidatePath('/cart');
};
