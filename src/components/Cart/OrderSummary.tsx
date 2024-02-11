'use client';

import { revalidatePathAction } from '@/lib/actions/checkout';
import { useCartItemsStore } from '@/lib/store/cart-store';
import { CartItemProps } from '@/lib/types/cart';
import { priceFormat } from '@/lib/util';
import { MoveRight } from 'lucide-react';
import Link from 'next/link';
import { Button } from '../UI/Button';
import Divider from '../UI/Divider';
import { SectionHeading } from '../UI/Homepage';

const OrderSummary = ({
  cartItemsData,
  deliveryCharge,
}: {
  cartItemsData: CartItemProps[];
  deliveryCharge: number;
}) => {
  const cartItemsState = useCartItemsStore((store) => store.cartItems);
  const cartItems = cartItemsState.length > 0 ? cartItemsState : cartItemsData;

  const subtotal = cartItems.reduce(
    (acc, curr) => acc + Number.parseFloat(curr.price) * curr.quantity,
    0,
  );

  const discount = subtotal * 0;
  const total = subtotal + deliveryCharge - discount;

  return (
    <div className="h-max rounded-main border border-primary-100 p-4 sm:p-5 md:p-6 lg:col-span-2">
      <h3 className="mb-4 font-geist text-xl font-semibold capitalize sm:text-2xl lg:mb-8">
        Order Summary
      </h3>
      <div className="grid gap-4 text-sm font-medium sm:text-base md:grid-cols-[1fr_auto_1fr] md:gap-6 lg:grid-cols-1 lg:text-lg lg:font-normal">
        <dl className="space-y-1.5 md:mb-0 lg:space-y-4">
          <div className="flex items-center justify-between">
            <dd className="text-primary-400">Subtotal</dd>
            <dt className="font-semibold">{priceFormat(subtotal)}</dt>
          </div>
          <div className="flex items-center justify-between">
            <dd className="text-primary-400">Discount</dd>
            <dt className="font-semibold text-emerald-500">
              {priceFormat(discount)}
            </dt>
          </div>
          <div className="flex items-center justify-between">
            <dd className="flex items-center gap-2 text-primary-400">
              Delivery Charge
            </dd>
            <dt className="font-semibold">{priceFormat(deliveryCharge)}</dt>
          </div>
          <div className="flex items-center justify-between text-lg sm:text-xl lg:pt-2 lg:text-2xl">
            <dd className="font-semibold lg:font-medium">Total</dd>
            <dt className="font-semibold">{priceFormat(total)}</dt>
          </div>
        </dl>
        <div className="hidden h-full w-px bg-primary-50 md:block lg:hidden"></div>
        <div className="flex items-center justify-center">
          <Button
            asChild
            size={'xl'}
            className="w-full gap-3"
            onClick={() => revalidatePathAction('/checkout')}
          >
            <Link href={'/checkout'}>
              Go to checkout
              <MoveRight />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};
export default OrderSummary;
