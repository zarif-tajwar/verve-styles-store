export type CartItemProps = {
  name: string;
  price: string;
  sizeName: string;
  cartItemId: number;
  quantity: number;
};

export type CartItemState = Pick<
  CartItemProps,
  'cartItemId' | 'price' | 'quantity'
>;
