'use client';

import { cn, priceFormat } from '@/lib/util';
import { MoveRight, Tag } from 'lucide-react';
import Divider from '../UI/Divider';
import { Button } from '../UI/Button';
import { useCartItemsStore } from '@/lib/store/cart-store';
import { CartItemProps } from '@/lib/types/cart';

const OrderSummary = ({
  cartItemsData,
}: {
  cartItemsData: CartItemProps[];
}) => {
  const cartItemsState = useCartItemsStore((store) => store.cartItems);
  const cartItems = cartItemsState.length > 0 ? cartItemsState : cartItemsData;

  const subtotal = cartItems.reduce(
    (acc, curr) => acc + Number.parseFloat(curr.price) * curr.quantity,
    0,
  );

  const discount = subtotal * 0.05;
  const deliveryCharge = 25;
  const total = subtotal + deliveryCharge - discount;

  return (
    <div className="sticky top-20 col-span-2 h-max rounded-main p-6 ring-1 ring-primary-100 @container">
      <h2 className="mb-6 font-geist text-2xl capitalize">Order Summary</h2>
      <div className="block grid-cols-[1fr_auto_1.2fr] justify-between gap-6 @2xl:grid">
        <div className="space-y-5">
          <p className="flex items-center justify-between">
            <span className="text-lg text-primary-400">Subtotal</span>
            <span className="text-xl font-semibold">
              {priceFormat(subtotal)}
            </span>
          </p>
          <p className="flex items-center justify-between">
            <span className="text-lg text-primary-400">Discount</span>
            <span className="text-xl font-semibold text-green-500">
              {priceFormat(discount)}
            </span>
          </p>
          <p className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-lg text-primary-400">
              Delivery Charge
            </span>
            <span className="text-xl font-semibold">
              {priceFormat(deliveryCharge)}
            </span>
          </p>
          <p className="mb-6 flex items-center justify-between">
            <span className="text-xl font-medium">Total</span>
            <span className="text-2xl font-semibold">{priceFormat(total)}</span>
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
  );
};
export default OrderSummary;
