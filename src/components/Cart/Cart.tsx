'use client';

import { CartItemProps } from '@/lib/types/cart';
import React, { useEffect } from 'react';
import CartItem from './CartItem';
import Divider from '../UI/Divider';
import { useCartItemsStore } from '@/lib/store/cart-store';
import OrderSummary from './OrderSummary';

const Cart = ({ cartItemsData }: { cartItemsData: CartItemProps[] }) => {
  const [inserCartItems, clearCart] = useCartItemsStore((store) => [
    store.insertCartItems,
    store.clearCart,
  ]);

  useEffect(() => {
    inserCartItems(cartItemsData);
    return () => {
      clearCart();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <h1 className="mb-6 font-integral-cf text-4xl">My Cart</h1>
      <div className="flex grid-cols-5 flex-col gap-5 lg:grid">
        <div className="col-span-3 h-max rounded-main p-6 ring-1 ring-primary-100">
          {cartItemsData.map((cartItem, i) => {
            return (
              <React.Fragment key={i}>
                <CartItem cartItem={cartItem} />
                {i < cartItemsData.length - 1 && <Divider className="my-6" />}
              </React.Fragment>
            );
          })}
        </div>
        <OrderSummary cartItemsData={cartItemsData} />
      </div>
    </>
  );
};
export default Cart;
