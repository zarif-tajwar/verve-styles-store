import { DateRange } from 'react-day-picker';
import { create } from 'zustand';

type CheckoutStoreAction = {
  setShippingAdressMode: (
    mode: CheckoutStore['shippingAddress']['mode'],
  ) => void;
};

type CheckoutStore = {
  shippingAddress: {
    mode: 'input' | 'select';
  };
};

const initialState: CheckoutStore = {
  shippingAddress: {
    mode: 'select',
  },
};

export const useCheckoutStore = create<CheckoutStore & CheckoutStoreAction>()(
  (set) => ({
    ...initialState,
    setShippingAdressMode: (mode) => {
      set((state) => {
        return {
          ...state,
          shippingAddress: { ...state.shippingAddress, mode },
        };
      });
    },
  }),
);
