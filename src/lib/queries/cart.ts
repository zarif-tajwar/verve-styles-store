'use client';

import { errorToast } from '@/components/UI/Toaster';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import {
  deleteCartItemAction,
  updateCartItemQuantityAction,
} from '../actions/cart';
import { CART_ITEM_DATA_QUERY_KEY } from '../constants/query-keys';
import { FetchedCartItem } from '../server/cart';
import { wait } from '../util';

export const useCartItemsQuery = () => {
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
      return cartItems;
    },
    refetchOnMount: false,
    placeholderData: (prev) => prev,
  });
};

export const useCartItemsMutations = ({
  cartItemId,
  refetchDelayAfterDeleteInMs = 0,
}: {
  cartItemId: string;
  refetchDelayAfterDeleteInMs?: number;
}) => {
  const queryClient = useQueryClient();

  const { mutateAsync: deleteMutation } = useMutation({
    mutationFn: deleteCartItemAction,
    onError: () => {
      queryClient.refetchQueries({ queryKey: CART_ITEM_DATA_QUERY_KEY });
      errorToast('Failed to delete the cart item!');
    },
  });

  const { mutateAsync: updateMutation } = useMutation({
    mutationFn: updateCartItemQuantityAction,
    onSettled: () => {},
    onError: () => {
      errorToast('Failed to update the quantity!');
      queryClient.refetchQueries({ queryKey: CART_ITEM_DATA_QUERY_KEY });
    },
  });

  const debouncedUpdateQuantity = useDebouncedCallback(updateMutation, 500);

  const handleQuantityUpdate = useCallback(
    async ({ newQuantity }: { newQuantity: number }) => {
      queryClient.setQueryData(
        CART_ITEM_DATA_QUERY_KEY,
        (old: FetchedCartItem[] | undefined) => {
          if (!old) return old;
          const updated = old.map((cartItem) => {
            if (cartItem.cartItemId !== cartItemId) return cartItem;
            return { ...cartItem, quantity: newQuantity };
          });
          return updated;
        },
      );
      await debouncedUpdateQuantity({ cartItemId, newQuantity });
    },
    [cartItemId, debouncedUpdateQuantity, queryClient],
  );

  const handleDelete = useCallback(async () => {
    if (refetchDelayAfterDeleteInMs > 0) {
      await Promise.all([
        deleteMutation(cartItemId),
        wait(refetchDelayAfterDeleteInMs),
      ]);
    } else {
      await deleteMutation(cartItemId);
    }
    queryClient.refetchQueries({ queryKey: CART_ITEM_DATA_QUERY_KEY });
  }, [cartItemId, deleteMutation, refetchDelayAfterDeleteInMs, queryClient]);

  return { handleQuantityUpdate, handleDelete };
};
