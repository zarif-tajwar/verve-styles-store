import { Button } from '@/components/UI/Button';
import CartQuantityCounter from '@/components/Cart/CartQuantityCounter';
import Divider from '@/components/UI/Divider';
import { cn, genRandomInt, priceFormat } from '@/lib/util';
import { MoveRight, Tag } from 'lucide-react';
import React from 'react';
import { db } from '@/lib/db';
import { cookies } from 'next/headers';
import { cartItems } from '@/lib/db/schema/cartItems';
import { eq } from 'drizzle-orm';
import { productEntries } from '@/lib/db/schema/productEntries';
import { products } from '@/lib/db/schema/products';
import { sizes } from '@/lib/db/schema/sizes';
import { CartItemProps } from '@/lib/types/cart';
import Cart from '@/components/Cart/Cart';

const CartPage = async () => {
  const cartId = Number(cookies().get('cartId')?.value);

  if (Number.isNaN(cartId)) {
    return (
      <div className="container-main py-20">
        <p>No items in the cart!</p>
      </div>
    );
  }

  const cartItemsData: CartItemProps[] = await db
    .select({
      name: products.name,
      price: products.price,
      sizeName: sizes.name,
      cartItemId: cartItems.id,
      quantity: cartItems.quantity,
    })
    .from(cartItems)
    .innerJoin(productEntries, eq(productEntries.id, cartItems.productEntryId))
    .innerJoin(products, eq(products.id, productEntries.productID))
    .innerJoin(sizes, eq(sizes.id, productEntries.sizeID))
    .where(eq(cartItems.cartId, cartId));

  if (cartItemsData.length < 1) {
    return (
      <div className="container-main py-20">
        <p>No items in the cart!</p>
      </div>
    );
  }

  return (
    <main className="container-main py-20">
      <Cart cartItemsData={cartItemsData} />
    </main>
  );
};
export default CartPage;
