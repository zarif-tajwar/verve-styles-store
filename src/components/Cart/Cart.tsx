'use client';

import CartItem from '@/components/Cart/CartItem';
import OrderSummary from '@/components/Cart/OrderSummary';
import { clearCartItems, generateCartItems } from '@/lib/actions/cart';
import { CART_ITEM_DATA_QUERY_KEY } from '@/lib/constants/query-keys';
import { useCartItemsQuery } from '@/lib/queries/cart';
import { FetchedCartItem } from '@/lib/server/cart';
import { cn } from '@/lib/util';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  LayoutGroup,
  motion,
  useMotionTemplate,
  useMotionValue,
} from 'framer-motion';
import { useEffect, useMemo, useRef } from 'react';
import { Button } from '../UI/Button';
import { ScrollArea } from '../UI/ScrollArea';
import Spinner from '../UI/Spinner';
import { SectionHeading } from '../UI/Homepage';

const CartItemsListing = ({
  cartItems,
  deliveryCharge,
}: {
  cartItems: FetchedCartItem[];
  deliveryCharge: number;
}) => {
  const height = useMotionValue(1);
  const heightFinal = useMotionTemplate`calc(${height}px - var(--vertical-padding))`;
  const cusRef = useRef(null);

  useEffect(() => {
    if (!cusRef.current) return;

    const observer = new ResizeObserver((entries) => {
      const element = entries.at(0);
      if (!element) return;
      height.set(element.contentRect.height);
    });

    observer.observe(cusRef.current);

    return () => {
      observer.disconnect();
    };
  }, [cusRef, height]);

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
      <h2 className="mb-6 px-4 font-integral-cf text-3xl sm:px-5 md:px-0 md:text-4xl">
        My Cart
      </h2>
      <div>
        <div
          className={cn(
            'grid h-full gap-x-5',
            'grid-cols-1 grid-rows-[1fr_auto]',
            'lg:grid-cols-5 lg:grid-rows-none',
            'gap-y-4 sm:gap-y-5 md:gap-y-6',
          )}
        >
          <div
            ref={cusRef}
            className="rounded-main border border-primary-100 pt-[var(--vertical-padding)] [--vertical-padding:1.5rem] lg:col-span-3"
          >
            <div className="px-2">
              <ScrollArea scrollBarClassName="w-2">
                <motion.div
                  style={{ height: heightFinal }}
                  className="flex flex-col px-4"
                >
                  <LayoutGroup>{CartComp}</LayoutGroup>
                </motion.div>
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
    <div className="absolute right-0 top-0 mx-auto mb-10 grid w-max -translate-y-full grid-cols-2 justify-center gap-4 rounded-main bg-primary-0 p-4 ring-1 ring-primary-100">
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
      {/* <TemporaryButtons /> */}
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
