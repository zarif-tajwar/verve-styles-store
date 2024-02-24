import Divider from '@/components/UI/Divider';
import { formatSizeText } from '@/components/UI/SizeBadge';
import { CartItemsForCheckout } from '@/lib/server/checkout';
import { cn, priceFormat } from '@/lib/util';
import Image from 'next/image';
import React from 'react';

const CheckoutCartItems = ({
  cartItems,
}: {
  cartItems: CartItemsForCheckout;
}) => {
  return (
    <div className="rounded-main border border-primary-100 p-6 @container xl:p-8">
      <div className="">
        <h2 className="text-xl font-semibold sm:text-2xl">
          Your shopping cart
        </h2>
        <p className="text-primary-400">
          {`View the products you're going to order`}
        </p>
      </div>
      <div className="mb-8 mt-6 h-px w-full bg-primary-100"></div>
      <ul className="grid auto-rows-auto gap-x-5 gap-y-8 @sm:grid-cols-2 @sm:gap-y-10 @xl:grid-cols-3 @xl:gap-y-12">
        {cartItems.map((cartItem, i) => {
          const pricePerUnit = Number.parseFloat(cartItem.price);
          const discountInPercentage = Number.parseFloat(
            cartItem.discount ?? '0',
          );
          const total =
            pricePerUnit * cartItem.quantity * (1 - discountInPercentage / 100);
          return (
            <React.Fragment key={i}>
              <li
                className={cn(
                  'row-span-2 grid grid-cols-1 grid-rows-subgrid gap-x-0 gap-y-0',
                  // 'flex flex-col',
                )}
              >
                <div>
                  <div className="relative mb-3 aspect-[1.2/1] max-h-min w-full overflow-hidden rounded-xl saturate-0">
                    {cartItem.image ? (
                      <Image
                        alt={`${cartItem.name} in ${cartItem.sizeName}`}
                        src={cartItem.image}
                        className="object-cover"
                        fill
                      />
                    ) : (
                      <span className="h-full w-full bg-primary-50"></span>
                    )}
                  </div>
                  <div className="mb-5">
                    <h4 className="text-base font-semibold leading-none text-primary-400">
                      {cartItem.name}
                    </h4>
                  </div>
                </div>
                <div className="flex flex-col justify-between gap-3">
                  <dl
                    className={cn(
                      'grid grid-cols-2 gap-x-4 gap-y-3 text-sm',
                      '[&_dd]:font-medium [&_dd]:text-primary-400',
                      '[&_dt]:font-semibold [&_dt]:text-primary-500',
                    )}
                  >
                    <div className="space-y-1">
                      <dd>Size</dd>
                      <dt>{formatSizeText(cartItem.sizeName)}</dt>
                    </div>
                    <div className="space-y-1">
                      <dd>Quantity</dd>
                      <dt>{cartItem.quantity}</dt>
                    </div>
                    <div className="space-y-1">
                      <dd>Price Per Unit</dd>
                      <dt>{priceFormat(pricePerUnit)}</dt>
                    </div>

                    {discountInPercentage > 0 && (
                      <div className="space-y-1">
                        <>
                          <dd>Discount</dd>
                          <dt>{discountInPercentage}%</dt>
                        </>
                      </div>
                    )}
                    <div className="space-y-1">
                      <dd>Total</dd>
                      <dt className="!font-semibold text-primary-500">
                        {priceFormat(total)}
                      </dt>
                    </div>
                  </dl>
                </div>
              </li>
            </React.Fragment>
          );
        })}
      </ul>
    </div>
  );
};
export default CheckoutCartItems;
