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
    <div className="rounded-main border-2 border-primary-50 p-6 xl:p-8">
      <div className="mb-12">
        <h2 className="text-2xl font-semibold">Your shopping cart</h2>
        <p className="text-primary-400">
          {`View the products you're going to order`}
        </p>
      </div>
      <ul className="grid auto-rows-auto grid-cols-[5rem_repeat(5,auto)] gap-x-4 rounded-lg">
        {cartItems?.map((cartItem, i) => {
          // const discount = 99;
          const discount = Number.parseFloat(cartItem.discount ?? '0');
          return (
            <React.Fragment key={cartItem.cartItemId}>
              <li className="col-span-6 row-span-2 grid grid-cols-subgrid grid-rows-subgrid gap-x-4 gap-y-0 text-xs">
                <div className="relative row-span-2 aspect-square size-[5rem] overflow-clip rounded-lg bg-primary-50 saturate-0">
                  {cartItem.image && (
                    <Image
                      src={cartItem.image}
                      alt={`${cartItem.name} in ${cartItem.sizeName}`}
                      fill
                    />
                  )}
                </div>
                <div className="col-span-5 row-span-2 grid grid-cols-subgrid gap-y-4">
                  <div className="col-span-5">
                    <h4 className="text-base font-medium text-primary-500">
                      {cartItem.name}
                    </h4>
                  </div>
                  <dl
                    className={cn(
                      'col-span-5 grid grid-cols-subgrid grid-rows-2 gap-x-4 gap-y-0',
                      '[&_dd]:font-medium [&_dd]:text-primary-400',
                      '[&_dt]:font-semibold [&_dt]:leading-none [&_dt]:text-primary-500',
                    )}
                  >
                    <div className="row-span-2 grid grid-rows-subgrid gap-y-1.5">
                      <dd>Size</dd>
                      <dt>{formatSizeText(cartItem.sizeName)}</dt>
                    </div>
                    <div className="row-span-2 grid grid-rows-subgrid gap-y-1.5">
                      <dd>Price Per Unit</dd>
                      <dt>{priceFormat(Number.parseFloat(cartItem.price))}</dt>
                    </div>
                    <div className="row-span-2 grid grid-rows-subgrid gap-y-1.5">
                      <dd>Quantity</dd>
                      <dt>{cartItem.quantity}</dt>
                    </div>

                    <div className="row-span-2 grid grid-rows-subgrid gap-y-1.5">
                      {discount > 0 && (
                        <>
                          <dd>Discount</dd>
                          <dt>{discount}%</dt>
                        </>
                      )}
                    </div>
                    <div className="row-span-2 grid grid-rows-subgrid gap-y-1.5">
                      <dd>Total</dd>
                      <dt className="!font-semibold text-primary-500">
                        {priceFormat(
                          Number.parseFloat(cartItem.price) *
                            cartItem.quantity *
                            (1 -
                              Number.parseFloat(cartItem.discount ?? '0') /
                                100),
                        )}
                      </dt>
                    </div>
                  </dl>
                </div>
              </li>
              <Divider className="col-span-6 my-4 bg-primary-100 last:hidden" />
            </React.Fragment>
          );
        })}
      </ul>
    </div>
  );
};
export default CheckoutCartItems;
