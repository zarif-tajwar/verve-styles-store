'use client';

import { useQuery } from '@tanstack/react-query';
import { CART_ITEM_DATA_QUERY_KEY } from '../constants/query-keys';
import { useCartItemsStore } from '../store/cart-store';
import { FetchedCartItem } from '../server/cart';
import { errorToast } from '@/components/UI/Toaster';
import { wait } from '../util';

export const useCartItemsQuery = () => {
  const insertCartItemsClient = useCartItemsStore(
    (state) => state.insertCartItems,
  );
  const clearCartClient = useCartItemsStore((state) => state.clearCart);
  return useQuery({
    queryKey: CART_ITEM_DATA_QUERY_KEY,
    queryFn: async () => {
      let cartItems: FetchedCartItem[] = [];
      try {
        const res = await fetch('/api/cart');
        if (!res.ok) {
          throw new Error();
        } else {
          cartItems = (await res.json()).data;
        }
      } catch (error) {
        errorToast('Something went wrong while fetching the cart!');
      }
      clearCartClient();
      insertCartItemsClient(cartItems);
      return cartItems;
    },
    refetchOnMount: false,
    placeholderData: (prev) => prev,
  });
};
