'use client';

import { priceFormat } from '@/lib/util';
import { deleteCartItem } from '@/app/_actions/cart';
import CartQuantityCounter from './CartQuantityCounter';
import { CartItemProps } from '@/lib/types/cart';
import { useCartItemsStore } from '@/lib/store/cart-store';
import { useEffect } from 'react';
import { trpc } from '@/app/_trpc/client';
import { CART_QUANTITY_CHANGE_DELAY } from '@/lib/validation/constants';

const CartItemClient = ({ cartItem }: { cartItem: CartItemProps }) => {
  const getCartItem = useCartItemsStore((store) => store.getCartItem);
  const updateQuantity = useCartItemsStore((store) => store.updateQuantity);
  const deleteCartItemState = useCartItemsStore(
    (store) => store.deleteCartItem,
  );
  const updateQuantityServer = trpc.updateCartQuantity.useMutation({});
  const deleteCartItemServer = trpc.deleteCartItem.useMutation({});

  const cartItemState = getCartItem(cartItem.cartItemId);
  const cartItemData = cartItemState ? cartItemState : cartItem;

  const totalPrice = priceFormat(
    Number.parseFloat(cartItemData.price || '0') * cartItemData.quantity,
  );

  useEffect(() => {
    if (cartItem.quantity === cartItemState?.quantity) {
      return;
    }
    const timeout = setTimeout(() => {
      const updateQuantity = updateQuantityServer
        .mutateAsync({
          cartItemId: cartItemData.cartItemId,
          newQuantity: cartItemData.quantity,
        })
        .then((res) => console.log(res));
    }, CART_QUANTITY_CHANGE_DELAY);

    return () => clearTimeout(timeout);
  }, [cartItemState]);

  return (
    <>
      <span className="block text-xl font-bold">{totalPrice}</span>
      <div className="flex h-full items-start justify-end">
        <button
          onClick={async (e) => {
            e.preventDefault();
            await deleteCartItemServer.mutateAsync({
              cartItemId: cartItemData.cartItemId,
            });
            deleteCartItemState(cartItem.cartItemId);
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
        onChange={(quantity) => {
          updateQuantity(cartItem.cartItemId, quantity);
        }}
      />
    </>
  );
};

export default CartItemClient;
