import React from 'react';
import Cart from '@/components/Cart/Cart';
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from '@tanstack/react-query';
import { getCartItemsServer } from '@/lib/actions/cart';
import * as queryKeys from '@/lib/constants/query-keys';

const staticCartItems = [
  {
    name: 'Oriental Concrete Towels',
    price: '7448.00',
    sizeName: '2xl',
    cartItemId: 123365,
    quantity: 10,
  },
  {
    name: 'Rustic Granite Chair',
    price: '6595.00',
    sizeName: '2xl',
    cartItemId: 123364,
    quantity: 10,
  },
  {
    name: 'Handcrafted Metal Keyboard',
    price: '5590.00',
    sizeName: '2xl',
    cartItemId: 123363,
    quantity: 5,
  },
  {
    name: 'Unbranded Rubber Car',
    price: '8486.00',
    sizeName: 'small',
    cartItemId: 123362,
    quantity: 6,
  },
  {
    name: 'Ergonomic Granite Computer',
    price: '8449.00',
    sizeName: 'large',
    cartItemId: 123361,
    quantity: 6,
  },
  {
    name: 'Oriental Concrete Towels',
    price: '7448.00',
    sizeName: '2xl',
    cartItemId: 123365,
    quantity: 10,
  },
  {
    name: 'Rustic Granite Chair',
    price: '6595.00',
    sizeName: '2xl',
    cartItemId: 123364,
    quantity: 10,
  },
  {
    name: 'Handcrafted Metal Keyboard',
    price: '5590.00',
    sizeName: '2xl',
    cartItemId: 123363,
    quantity: 5,
  },
  {
    name: 'Unbranded Rubber Car',
    price: '8486.00',
    sizeName: 'small',
    cartItemId: 123362,
    quantity: 6,
  },
  {
    name: 'Ergonomic Granite Computer',
    price: '8449.00',
    sizeName: 'large',
    cartItemId: 123361,
    quantity: 6,
  },
];

const CartPage = async () => {
  // const queryClient = new QueryClient({
  //   defaultOptions: {
  //     queries: {
  //       refetchOnMount: false,
  //       refetchOnWindowFocus: false,
  //       refetchOnReconnect: false,
  //     },
  //   },
  // });
  // await queryClient.prefetchQuery({
  //   queryKey: queryKeys.CART_ITEM_DATA,
  //   queryFn: getCartItemsServer,
  // });
  return (
    // <HydrationBoundary state={dehydrate(queryClient)}>
    <Cart />
    // </HydrationBoundary>
  );
};

export default CartPage;
