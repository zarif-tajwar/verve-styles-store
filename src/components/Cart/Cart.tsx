'use client';

import React, { useMemo } from 'react';
import OrderSummary from '@/components/Cart/OrderSummary';
import CartItem from '@/components/Cart/CartItem';
import { Button } from '../UI/Button';
import { LayoutGroup, motion } from 'framer-motion';
import { useMutation } from '@tanstack/react-query';
import { clearCartItems, generateCartItems } from '@/lib/actions/cart';
import { useCartItemsQuery } from '@/lib/queries/cart';
import { cartItems } from '@/lib/db/schema/cartItems';
import Spinner from '../UI/Spinner';

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
        return <CartItem key={cartItem.cartItemId} cartItem={cartItem} />;
      });
    else return null;
  }, [cartItemsData]);

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
    <main className="container-main py-20">
      <div className="mx-auto mb-10 grid w-max grid-cols-2 justify-center gap-4 rounded-main p-4 ring-1 ring-primary-100">
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

      {cartItemsData && cartItemsData.length > 0 && (
        <div>
          <h1 className="mb-6 font-integral-cf text-4xl">My Cart</h1>
          <div className="flex grid-cols-5 flex-col gap-5 lg:grid">
            <LayoutGroup>
              <motion.div
                // layout
                // transition={{ duration: 1 }}
                style={{ borderRadius: 20 }}
                className="col-span-3 flex h-max flex-col px-6 ring-1 ring-primary-100"
              >
                {CartComp}
              </motion.div>
            </LayoutGroup>
            <OrderSummary
              deliveryCharge={deliveryCharge}
              cartItemsData={cartItemsData}
            />
          </div>
        </div>
      )}
      {isFetched && cartItemsData && cartItemsData.length === 0 && (
        <div className="text-2xl font-bold">Your cart is empty!</div>
      )}
    </main>
  );
};
export default Cart;
