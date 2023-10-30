'use client';

import React, { useEffect, useMemo } from 'react';
import OrderSummary from '@/components/Cart/OrderSummary';
import Divider from '@/components/UI/Divider';
import CartItem from '@/components/Cart/CartItem';
import { trpc } from '@/app/_trpc/client';
import { useCartItemsStore } from '@/lib/store/cart-store';
import { serverClient } from '@/app/_trpc/serverClient';
import { Button } from '../UI/Button';

const Cart = ({
  initialData,
}: {
  initialData: Awaited<ReturnType<(typeof serverClient)['getCartItems']>>;
}) => {
  const { insertCartItems, clearCart } = useCartItemsStore();
  const cartItemsQuery = trpc.getCartItems.useQuery(undefined, {
    initialData,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
  const generateRandomCartItems = trpc.generateCartItems.useMutation({
    onSettled: async () => {
      const refetched = await cartItemsQuery.refetch();
      clearCart();
      const data = refetched.data;
      if (data) insertCartItems(data);
    },
  });
  const clearCartServer = trpc.clearCartItems.useMutation({
    onSettled: async () => {
      await cartItemsQuery.refetch();
      clearCart();
    },
  });
  const cartItemsData = cartItemsQuery.data;

  console.log(cartItemsData);

  useEffect(() => {
    if (cartItemsData && cartItemsData.length > 0) {
      insertCartItems(cartItemsData);
    }
  }, []);

  return (
    <main className="container-main py-20">
      <div className="mx-auto mb-10 grid w-max grid-cols-2 justify-center gap-4 rounded-main p-4 ring-1 ring-primary-100">
        <p className="col-span-2">Temporary Buttons for Testing</p>
        <Button
          onClick={async () => {
            await generateRandomCartItems.mutateAsync(5);
          }}
        >
          Add 5 Random Products
        </Button>
        <Button
          variant={'outline'}
          onClick={async () => {
            await clearCartServer.mutateAsync();
          }}
        >
          Clear Cart
        </Button>
      </div>
      {cartItemsData && cartItemsData.length > 0 ? (
        <>
          <h1 className="mb-6 font-integral-cf text-4xl">My Cart</h1>
          <div className="flex grid-cols-5 flex-col gap-5 lg:grid">
            <div className="col-span-3 h-max rounded-main p-6 ring-1 ring-primary-100">
              {cartItemsData.map((cartItem, i) => {
                return (
                  <React.Fragment key={i}>
                    <CartItem cartItem={cartItem} />
                    {i < cartItemsData.length - 1 && (
                      <Divider className="my-6" />
                    )}
                  </React.Fragment>
                );
              })}
            </div>
            <OrderSummary cartItemsData={cartItemsData} />
          </div>
        </>
      ) : (
        <p>Your shopping cart is empty!</p>
      )}
    </main>
  );
};
export default Cart;
