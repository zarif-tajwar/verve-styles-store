import { create } from 'zustand';
import {
  defaultPriceRange,
  defaultSortOptionValue,
} from '../validation/constants';
import { ShopFilterState } from '../types/ShopFilter';
import { CartItemState } from '../types/cart';
import { cartItems } from '../db/schema/cartItems';

type CartStoreAction = {
  updateQuantity: (
    cartItemId: CartItemState['cartItemId'],
    quantity: CartItemState['quantity'],
  ) => void;
  deleteCartItem: (cartItemId: CartItemState['cartItemId']) => void;
  insertCartItems: (cartItems: CartItemState[]) => void;
};

type CartStore = {
  cartItems: CartItemState[];
};

export const useShopFilterStore = create<CartStore & CartStoreAction>()(
  (set) => ({
    cartItems: [],
    updateQuantity: (cartItemId, quantity) => {
      set((state) => ({
        cartItems: state.cartItems.map((cartItem) => {
          if (cartItem.cartItemId === cartItemId) {
            return { ...cartItem, quantity };
          }
          return cartItem;
        }),
      }));
    },
    deleteCartItem: (cartItemId) => {
      set((state) => ({
        cartItems: state.cartItems.filter(
          (cartItem) => cartItem.cartItemId !== cartItemId,
        ),
      }));
    },
    insertCartItems: (cartItems) => {
      set({ cartItems });
    },
  }),
);
