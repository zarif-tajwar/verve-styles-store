'use client';

import { useQuery } from '@tanstack/react-query';
import { getCartItemsServer } from '../actions/cart';
import { CART_ITEM_DATA_QUERY_KEY } from '../constants/query-keys';
import { useCartItemsStore } from '../store/cart-store';

export const useCartItemsQuery = () => {
  const insertCartItemsClient = useCartItemsStore(
    (state) => state.insertCartItems,
  );
  const clearCartClient = useCartItemsStore((state) => state.clearCart);
  return useQuery({
    queryKey: CART_ITEM_DATA_QUERY_KEY,
    queryFn: async () => {
      const data = await getCartItemsServer();
      if (!data || data.length < 1) return [];
      clearCartClient();
      insertCartItemsClient(data);
      return data ?? [];
    },
    refetchOnMount: false,
    placeholderData: (prev) => prev,
  });
};
