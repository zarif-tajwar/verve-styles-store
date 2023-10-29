import { CartItemProps } from '@/lib/types/cart';
import CartItemClient from './CartItemClient';

const CartItem = ({ cartItem }: { cartItem: CartItemProps }) => {
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
        <CartItemClient cartItem={cartItem} />
      </div>
    </div>
  );
};

export default CartItem;
