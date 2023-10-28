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
import CartItem from '@/components/Cart/CartItem';

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
    <div className="container-main py-20">
      <h1 className="mb-6 font-integral-cf text-4xl">My Cart</h1>
      <div className="flex grid-cols-5 flex-col gap-5 lg:grid">
        <div className="col-span-3 h-max rounded-main p-6 ring-1 ring-primary-100">
          {cartItemsData.map((cartItem, i) => {
            return (
              <React.Fragment key={i}>
                <CartItem cartItem={cartItem} />
                {i < cartItemsData.length - 1 && <Divider className="my-6" />}
              </React.Fragment>
            );
          })}
        </div>
        <div className="sticky top-20 col-span-2 h-max rounded-main p-6 ring-1 ring-primary-100 @container">
          <h2 className="mb-6 font-inter text-2xl capitalize">Order Summary</h2>
          <div className="block grid-cols-[1fr_auto_1.2fr] justify-between gap-6 @2xl:grid">
            <div className="space-y-5">
              <p className="flex items-center justify-between">
                <span className="text-lg text-primary-400">Subtotal</span>
                <span className="text-xl font-semibold">
                  {priceFormat(565)}
                </span>
              </p>
              <p className="flex items-center justify-between">
                <span className="text-lg text-primary-400">Discount</span>
                <span className="text-xl font-semibold text-green-500">
                  {priceFormat(genRandomInt(10, 120) * -1)}
                </span>
              </p>
              <p className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-lg text-primary-400">
                  Delivery Charge
                </span>
                <span className="text-xl font-semibold">
                  {priceFormat(genRandomInt(10, 50) * -1)}
                </span>
              </p>
              <p className="mb-6 flex items-center justify-between">
                <span className="text-xl font-medium">Total</span>
                <span className="text-2xl font-semibold">
                  {priceFormat(476)}
                </span>
              </p>
            </div>
            <Divider className="mb-5 mt-10 block @2xl:hidden" />
            <Divider className="mx-2 hidden @2xl:block" horizontal />
            <div className="block flex-col justify-center @lg:flex">
              <div className="mb-6 flex h-12 w-full gap-3">
                <div className="relative flex-grow">
                  <input
                    type="text"
                    className={cn(
                      'peer h-full w-full rounded-full border-none bg-primary-50 pl-12 pr-4 text-primary-400 outline-none',
                      'focus-within:ring-2 focus-within:ring-primary-400',
                      'transition-all duration-200',
                    )}
                    placeholder="Add promo code"
                  />
                  <Tag
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-300 transition-all duration-200 peer-focus-within:text-primary-400"
                    size={20}
                    absoluteStrokeWidth
                  />
                </div>
                <Button size={'default'} className="h-full w-32">
                  Apply
                </Button>
              </div>
              <Button size={'xl'} className="w-full gap-3">
                Go to checkout
                <MoveRight />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default CartPage;
