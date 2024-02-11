'use client';

import CartItem from '@/components/Cart/CartItem';
import OrderSummary from '@/components/Cart/OrderSummary';
import { clearCartItems, generateCartItems } from '@/lib/actions/cart';
import { useElementSize } from '@/lib/hooks/useResizeObserver';
import { useCartItemsQuery } from '@/lib/queries/cart';
import { FetchedCartItem } from '@/lib/server/cart';
import { cn } from '@/lib/util';
import {
  QueryClient,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { LayoutGroup } from 'framer-motion';
import { useMemo, useState } from 'react';
import { ScrollArea } from '../UI/ScrollArea';
import Spinner from '../UI/Spinner';
import { CART_ITEM_DATA_QUERY_KEY } from '@/lib/constants/query-keys';
import { Button } from '../UI/Button';

const CartItemsListing = ({
  cartItems,
  deliveryCharge,
}: {
  cartItems: FetchedCartItem[];
  deliveryCharge: number;
}) => {
  const { ref, height: scrollAreaHeight } = useElementSize();

  const CartComp = useMemo(() => {
    if (cartItems.length > 0)
      return cartItems.map((cartItem, i) => {
        return (
          <CartItem
            key={cartItem.name + cartItem.price}
            cartItem={cartItem}
            totalCartItems={cartItems.length}
            index={i}
          />
        );
      });
    else return null;
  }, [cartItems]);

  console.log('CART LISTING PARENT RENDERED');

  return (
    <div className="grid h-full grid-cols-1 grid-rows-[auto_1fr]">
      <h2 className="mb-6 font-integral-cf text-4xl">
        My Cart
        <span>{scrollAreaHeight}</span>
      </h2>
      <div className="bg-green-50">
        <div
          className={cn(
            'grid h-full gap-5',
            'grid-cols-1 grid-rows-[1fr_auto]',
            'lg:grid-cols-5 lg:grid-rows-none',
          )}
        >
          <div
            ref={ref}
            className="rounded-main border border-primary-100 bg-yellow-50 pt-[var(--vertical-padding)] [--vertical-padding:1.5rem] lg:col-span-3"
          >
            <div className="px-2">
              <ScrollArea
                style={{
                  height: !scrollAreaHeight
                    ? '30vh'
                    : `calc(${scrollAreaHeight}px - var(--vertical-padding))`,
                }}
                className="bg-indigo-400"
                scrollBarClassName="w-2"
              >
                <div className="flex flex-col px-4">
                  <LayoutGroup>{CartComp}</LayoutGroup>
                </div>
              </ScrollArea>
            </div>
          </div>
          <OrderSummary
            deliveryCharge={deliveryCharge}
            cartItemsData={cartItems}
          />
        </div>
      </div>
    </div>
  );
};

const TemporaryButtons = () => {
  const queryClient = useQueryClient();

  const { mutateAsync: generateCartItemsMutate } = useMutation({
    mutationFn: generateCartItems,
    onSuccess: async () => {
      await queryClient.refetchQueries({ queryKey: CART_ITEM_DATA_QUERY_KEY });
    },
  });
  const { mutateAsync: clearCartItemsMutate } = useMutation({
    mutationFn: clearCartItems,
    onSuccess: async () => {
      await queryClient.refetchQueries({ queryKey: CART_ITEM_DATA_QUERY_KEY });
    },
  });

  return (
    <div className="absolute right-0 top-0 mx-auto mb-10 grid w-max grid-cols-2 justify-center gap-4 rounded-main bg-primary-0 p-4 ring-1 ring-primary-100">
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
    </div>
  );
};

const Cart = ({ deliveryCharge }: { deliveryCharge: number }) => {
  const { data, isLoading, isFetched } = useCartItemsQuery();

  const cartItemsData = data;

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

  console.log('CART PARENT RENDERED');

  return (
    <div className="relative h-full">
      <TemporaryButtons />
      {cartItemsData && cartItemsData.length > 0 && (
        <CartItemsListing
          cartItems={cartItemsData}
          deliveryCharge={deliveryCharge}
        />
      )}
      {isFetched && cartItemsData && cartItemsData.length === 0 && (
        <div className="text-2xl font-bold">Your cart is empty!</div>
      )}
    </div>
  );
};
export default Cart;
