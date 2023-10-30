import React from 'react';
import Cart from '@/components/Cart/Cart';
import { serverClient } from '../_trpc/serverClient';

const CartPage = async () => {
  const initialData = await serverClient.getCartItems();
  return <Cart initialData={initialData} />;
};

export default CartPage;
