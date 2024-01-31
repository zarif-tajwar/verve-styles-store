import { FetchedCartItem } from '../server/cart';

export type CartItemProps = FetchedCartItem;
export type CartItemState = Pick<
  CartItemProps,
  'cartItemId' | 'price' | 'quantity'
>;
