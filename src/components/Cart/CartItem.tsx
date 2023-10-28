import { CartItemProps } from '@/lib/types/cart';
import { priceFormat } from '@/lib/util';
import CartQuantityCounter from './CartQuantityCounter';
import CartItemDelete from './CartItemDelete';
import CartItemQuantityUpdate from './CartItemQuantityUpdate';

const CartItem = ({ cartItem }: { cartItem: CartItemProps }) => {
  return (
    <div className="flex w-full gap-4">
      <div className="h-32 w-32 rounded-xl bg-primary-100"></div>
      <div className="flex min-h-full flex-grow flex-col">
        <p className="text-xl font-semibold">{cartItem.name}</p>
        <div className="mb-auto">
          <span className="text-sm font-medium">
            Size:
            <span className="font-normal text-primary-400">
              {cartItem.sizeName}
            </span>
          </span>
        </div>
        <span className="text-xl font-bold">
          {priceFormat(Number.parseFloat(cartItem.price))}
        </span>
      </div>
      <div className="flex min-h-full flex-col items-end justify-between">
        <CartItemDelete cartItemId={cartItem.cartItemId} />
        <CartItemQuantityUpdate
          cartItemId={cartItem.cartItemId}
          quantity={cartItem.quantity}
        />
      </div>
    </div>
  );
};

export default CartItem;
