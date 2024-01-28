import Divider from '@/components/UI/Divider';
import SizeBadge, { formatSizeText } from '@/components/UI/SizeBadge';
import { CartItemsForCheckout } from '@/lib/server/checkout';
import { cn, priceFormat } from '@/lib/util';
import React from 'react';

const CheckoutCartItems = ({
  cartItems,
}: {
  cartItems: CartItemsForCheckout;
}) => {
  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-semibold">Your shopping cart</h2>
        <p className="text-primary-400">
          {`View the products you're going to order`}
        </p>
      </div>
      <ul className="grid max-w-2xl gap-4 rounded-lg p-4 shadow-sm">
        {cartItems?.map((cartItem) => {
          // const discount = 99;
          const discount = Number.parseFloat(cartItem.discount ?? '0');
          return (
            <React.Fragment key={cartItem.cartItemId}>
              <li className="grid grid-cols-[5rem_1fr] gap-4 text-xs">
                <div className="aspect-square rounded-lg bg-primary-50"></div>
                <div className="flex flex-col justify-between">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <h4 className="text-base text-primary-500">
                      {cartItem.name}
                    </h4>
                  </div>
                  <dl
                    className={cn(
                      'grid grid-cols-[0.7fr_1.3fr_1fr_1fr_1fr] gap-x-4',
                      // 'grid grid-cols-[0.7fr_1.3fr_1fr_1fr_1fr] gap-x-4',
                      // 'grid grid-cols-5 gap-x-4',
                      '[&_dd]:font-medium [&_dd]:text-primary-400',
                      '[&_dt]:font-semibold [&_dt]:text-primary-500',
                    )}
                  >
                    <div className="space-y-0.5">
                      <dd>Size</dd>
                      <dt>{formatSizeText(cartItem.sizeName)}</dt>
                    </div>
                    <div className="space-y-0.5">
                      <dd>Price Per Unit</dd>
                      <dt>{priceFormat(Number.parseFloat(cartItem.price))}</dt>
                    </div>
                    <div className="space-y-0.5">
                      <dd>Quantity</dd>
                      <dt>{cartItem.quantity}</dt>
                    </div>

                    <div className="space-y-0.5">
                      {discount > 0 && (
                        <>
                          <dd>Discount</dd>
                          <dt>{discount}%</dt>
                        </>
                      )}
                    </div>
                    <div className="space-y-0.5">
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
              <Divider className="bg-primary-50 last:hidden" />
            </React.Fragment>
          );
        })}
      </ul>
    </div>
  );
};
export default CheckoutCartItems;
