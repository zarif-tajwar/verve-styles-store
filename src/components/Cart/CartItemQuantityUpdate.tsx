'use client';

import CartQuantityCounter from './CartQuantityCounterOld';

const CartItemQuantityUpdate = ({
  quantity,
  cartItemId,
}: {
  quantity: number;
  cartItemId: number;
}) => {
  return <CartQuantityCounter initial={quantity} />;
};
export default CartItemQuantityUpdate;
