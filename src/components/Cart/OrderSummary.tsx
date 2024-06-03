'use client';

import { CartItemProps } from '@/lib/types/cart';
import { priceFormat } from '@/lib/util';
import CartCheckoutButton from './CartCheckoutButton';

const OrderSummary = ({
  cartItemsData,
  deliveryCharge,
}: {
  cartItemsData: CartItemProps[];
  deliveryCharge: number;
}) => {
  const subtotal = cartItemsData.reduce(
    (acc, curr) => acc + Number.parseFloat(curr.price) * curr.quantity,
    0,
  );

  const discount = subtotal * 0;
  const total = subtotal + deliveryCharge - discount;

  return (
    <div className="h-max rounded-main border border-primary-100 p-4 sm:p-5 md:p-6 lg:col-span-2">
      <h3 className="mb-4 font-geist text-xl font-bold capitalize sm:text-2xl lg:mb-8">
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
        <CartCheckoutButton />
      </div>
    </div>
  );
};
export default OrderSummary;
