'use client';

import CartItem from '@/components/Cart/CartItem';
import OrderSummary from '@/components/Cart/OrderSummary';
import { clearCartItems, generateCartItems } from '@/lib/actions/cart';
import { useCartItemsQuery } from '@/lib/queries/cart';
import { useMutation } from '@tanstack/react-query';
import { LayoutGroup, motion } from 'framer-motion';
import { useMemo, useRef } from 'react';
import Spinner from '../UI/Spinner';
import { Button } from '../UI/Button';
import { ScrollArea } from '../UI/ScrollArea';
import { useResizeObserver } from '@/lib/hooks/useResizeObserver';
import { cn } from '@/lib/util';

const Cart = ({ deliveryCharge }: { deliveryCharge: number }) => {
  const { data, refetch, isLoading, isFetched } = useCartItemsQuery();

  const { mutateAsync: generateCartItemsMutate } = useMutation({
    mutationFn: generateCartItems,
    onSuccess: () => {
      refetch();
    },
  });
  const { mutateAsync: clearCartItemsMutate } = useMutation({
    mutationFn: clearCartItems,
    onSuccess: () => {
      refetch();
    },
  });

  const cartItemsData = data;

  const CartComp = useMemo(() => {
    if (cartItemsData && cartItemsData.length > 0)
      return cartItemsData.map((cartItem, i) => {
        return (
          <CartItem
            key={cartItem.name + cartItem.price}
            cartItem={cartItem}
            totalCartItems={cartItemsData.length}
            index={i}
          />
        );
      });
    else return null;
  }, [cartItemsData]);

  const [ref, rect] = useResizeObserver();

  if (isLoading) {
    return (
      <main className="container-main py-20">
        <div className="flex h-[70svh] w-full items-center justify-center gap-4">
          <Spinner className="size-10" />
          <p className="text-xl font-medium text-primary-400">Loading...</p>
        </div>
      </main>
    );
  }

  return (
    <div className="relative h-full pt-10">
      {/* <div className="absolute right-0 top-0 mx-auto mb-10 grid w-max grid-cols-2 justify-center gap-4 rounded-main bg-primary-0 p-4 ring-1 ring-primary-100">
        <p className="col-span-2">Temporary Buttons for Testing</p>
        <Button
          onClick={async () => {
            await generateCartItemsMutate({ num: 5 });
          }}
        >
          Add 5 Random Products
        </Button>
        <Button
          variant={'outline'}
          onClick={async () => {
            await clearCartItemsMutate();
          }}
        >
          Clear Cart
        </Button>
      </div> */}
      <p className="absolute">{JSON.stringify(rect)}</p>

      {cartItemsData && cartItemsData.length > 0 && (
        <div className="grid h-full grid-cols-1 grid-rows-[auto_1fr]">
          <h2 className="mb-6 font-integral-cf text-4xl">My Cart</h2>
          <div ref={ref} className="bg-green-50">
            <div
              className={cn(
                'grid h-full grid-cols-5 flex-col gap-5 lg:grid',
                // 'grid',
              )}
            >
              <div className="col-span-3 rounded-main border border-primary-100 bg-yellow-50 py-[var(--vertical-padding)] [--vertical-padding:1.5rem]">
                <div className="px-2">
                  <ScrollArea scrollBarClassName="w-2">
                    <div
                      style={{
                        height: !rect.height
                          ? '30vh'
                          : `calc(${rect.height}px - (var(--vertical-padding) * 2) - 2px)`,
                        // : `${rect.height - 48 - 1 - 1}px`,
                      }}
                      className="flex flex-col px-4"
                    >
                      <LayoutGroup>{CartComp}</LayoutGroup>
                    </div>
                  </ScrollArea>
                </div>
              </div>
              <OrderSummary
                deliveryCharge={deliveryCharge}
                cartItemsData={cartItemsData}
              />
            </div>
          </div>
        </div>
      )}
      {isFetched && cartItemsData && cartItemsData.length === 0 && (
        <div className="text-2xl font-bold">Your cart is empty!</div>
      )}
    </div>
  );
};
export default Cart;
