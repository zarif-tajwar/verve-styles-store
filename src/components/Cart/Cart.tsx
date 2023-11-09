'use client';

import React, { useEffect, useMemo } from 'react';
import OrderSummary from '@/components/Cart/OrderSummary';
import Divider from '@/components/UI/Divider';
import CartItem from '@/components/Cart/CartItem';
import { trpc } from '@/app/_trpc/client';
import { useCartItemsStore } from '@/lib/store/cart-store';
import { serverClient } from '@/app/_trpc/serverClient';
import { Button } from '../UI/Button';
import { LayoutGroup, motion } from 'framer-motion';

const Cart = ({
  initialData,
}: {
  initialData: Awaited<ReturnType<(typeof serverClient)['getCartItems']>>;
}) => {
  const insertCartItems = useCartItemsStore((state) => state.insertCartItems);
  const clearCart = useCartItemsStore((state) => state.clearCart);
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

  const data = cartItemsQuery.data;

  const lol_str = 'lko';

  const cartItemsData = useMemo(() => data, [data]);

  console.log('PARENT RENDERED');

  useEffect(() => {
    if (cartItemsData && cartItemsData.length > 0) {
      insertCartItems(cartItemsData);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const CartComp = useMemo(() => {
    if (cartItemsData && cartItemsData.length > 0)
      return cartItemsData.map((cartItem, i) => {
        return <CartItem key={i} cartItem={cartItem} />;
      });
    else return null;
  }, [cartItemsData]);

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
            <motion.div
              layout
              className="col-span-3 flex h-max flex-col rounded-main px-6 ring-1 ring-primary-100"
            >
              <LayoutGroup>{CartComp}</LayoutGroup>
            </motion.div>
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
