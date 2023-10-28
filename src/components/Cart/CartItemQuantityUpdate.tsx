'use client';

import CartQuantityCounter from './CartQuantityCounter';

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
