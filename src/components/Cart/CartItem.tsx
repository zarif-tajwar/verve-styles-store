'use client';

import { priceFormat } from '@/lib/util';
import CartQuantityCounter from './CartQuantityCounter';
import { CartItemProps } from '@/lib/types/cart';
import { useCartItemsStore } from '@/lib/store/cart-store';
import { trpc } from '@/app/_trpc/client';
import useDebounce from '@/lib/hooks/useDebounce';
import { useQueryClient } from '@tanstack/react-query';
import { getQueryKey } from '@trpc/react-query';
import { memo, useCallback, useMemo } from 'react';
import { useShallow } from 'zustand/react/shallow';

const CartItem = memo(({ cartItem }: { cartItem: CartItemProps }) => {
  const cartItemState = useCartItemsStore(
    useShallow((state) =>
      state.cartItems.find(
        (cartItemState) => cartItemState.cartItemId === cartItem.cartItemId,
      ),
    ),
  );
  const updateQuantity = useCartItemsStore((state) => state.updateQuantity);
  const deleteCartItem = useCartItemsStore((state) => state.deleteCartItem);

  const cartItemData = cartItemState ? cartItemState : cartItem;

  const cartItemId = cartItemData.cartItemId;

  const updateQuantityServerTrpc = trpc.updateCartQuantity.useMutation({});

  const deleteCartItemServerTrpc = trpc.deleteCartItem.useMutation({});

  const updateQuantityServer = async (newQuantity: number) => {
    await updateQuantityServerTrpc.mutateAsync({
      cartItemId: cartItemId,
      newQuantity,
    });
  };

  const deleteCartItemServer = async () => {
    await deleteCartItemServerTrpc.mutateAsync({
      cartItemId: cartItemId,
    });
  };

  const debouncedUpdateQuantity = useDebounce((newQuantity: number) => {
    updateQuantityServer(newQuantity);
    console.log(newQuantity);
  }, 500);

  const queryClient = useQueryClient();

  const totalPrice = priceFormat(
    Number.parseFloat(cartItemData.price || '0') * cartItemData.quantity,
  );

  const queryKey = useMemo(() => getQueryKey(trpc.getCartItems), []);

  const handleQuantityChange = async (newQuantity: number) => {
    updateQuantity(cartItem.cartItemId, newQuantity);
    debouncedUpdateQuantity(newQuantity);
  };

  console.log(`${cartItem.name}: RENDERED`);

  return (
    <div className="flex w-full gap-4">
      <div className="h-32 w-32 rounded-xl bg-primary-100"></div>
      <div className="grid min-h-full flex-grow grid-flow-col grid-rows-[auto_auto] content-between items-end justify-between">
        <div className="flex flex-col">
          <p className="text-xl font-semibold">{cartItem.name}</p>
          <span className="text-sm font-medium">
            Size:
            <span className="font-normal text-primary-400">
              {cartItem.sizeName}
            </span>
          </span>
        </div>
        <span className="block text-xl font-semibold">{totalPrice}</span>
        <div className="flex h-full items-start justify-end">
          <button
            onClick={async (e) => {
              e.preventDefault();
              await deleteCartItemServer();
              deleteCartItem(cartItem.cartItemId);
              await queryClient.refetchQueries({
                queryKey,
              });
            }}
            className="inline-flex h-5 items-center justify-center text-red-500"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="20"
              viewBox="0 0 448 512"
              fill="currentColor"
            >
              <path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z" />
            </svg>
          </button>
        </div>
        <CartQuantityCounter
          initial={cartItem.quantity}
          onChange={handleQuantityChange}
        />
      </div>
    </div>
  );
});

CartItem.displayName = 'CartItem';

export default CartItem;
