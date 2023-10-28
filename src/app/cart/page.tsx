import { Button } from '@/components/UI/Button';
import CartQuantityCounter from '@/components/Cart/CartQuantityCounter';
import Divider from '@/components/UI/Divider';
import { cn, priceFormat } from '@/lib/util';
import {
  ArrowRight,
  MoveRight,
  Tag,
  Trash2,
  Truck,
  TruckIcon,
} from 'lucide-react';
import React from 'react';

const CartPage = () => {
  const productItems = [...Array(3).keys()];

  return (
    <div className="container-main py-20">
      <h1 className="mb-6 font-integral-cf text-4xl">My Cart</h1>
      <div className="flex grid-cols-5 flex-col gap-5 lg:grid">
        <div className="col-span-3 rounded-main p-6 ring-1 ring-primary-100">
          {productItems.map((_, i) => {
            return (
              <React.Fragment key={i}>
                <CartItem />
                {i < productItems.length - 1 && <Divider className="my-6" />}
              </React.Fragment>
            );
          })}
        </div>
        <div className="@container sticky top-20 col-span-2 h-max rounded-main p-6 ring-1 ring-primary-100">
          <h2 className="mb-6 font-inter text-2xl capitalize">Order Summary</h2>
          <div className="@2xl:grid block grid-cols-[1fr_auto_1.2fr] justify-between gap-6">
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
                  {priceFormat(-113)}
                </span>
              </p>
              <p className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-lg text-primary-400">
                  <TruckIcon size={20} /> Delivery Charge
                </span>
                <span className="text-xl font-semibold">{priceFormat(15)}</span>
              </p>
              <p className="mb-6 flex items-center justify-between">
                <span className="text-xl font-medium">Total</span>
                <span className="text-2xl font-semibold">
                  {priceFormat(476)}
                </span>
              </p>
            </div>
            <Divider className="@2xl:hidden mb-5 mt-10 block" />
            <Divider className="@2xl:block mx-2 hidden" horizontal />
            <div className="@lg:flex block flex-col justify-center">
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

const CartItem = () => {
  return (
    <div className="flex w-full gap-4">
      <div className="h-32 w-32 rounded-xl bg-primary-100"></div>
      <div className="flex min-h-full flex-grow flex-col">
        <p className="text-xl font-semibold">Gradient Graphic T-Shirt</p>
        <div className="mb-auto">
          <span className="text-sm font-medium">
            Size:{' '}
            <span className="font-normal text-primary-400">Small, XL</span>
          </span>
        </div>
        <span className="text-xl font-bold">{priceFormat(237)}</span>
      </div>
      <div className="flex min-h-full flex-col items-end justify-between">
        <button>
          <span className="inline-flex h-5 items-center justify-center text-red-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="full"
              viewBox="0 0 448 512"
              fill="currentColor"
            >
              <path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z" />
            </svg>
          </span>
        </button>
        <CartQuantityCounter />
      </div>
    </div>
  );
};
