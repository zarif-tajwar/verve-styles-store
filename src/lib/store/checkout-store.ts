import { DateRange } from 'react-day-picker';
import { create } from 'zustand';
import { AddressFormSchemaType } from '../validation/address-form';

type CheckoutStoreAction = {
  setShippingAdressMode: (
    mode: CheckoutStore['shippingAddress']['mode'],
  ) => void;
};

type CheckoutStore = {
  shippingAddress: {
    mode: 'input' | 'select';
    inputForm: { values: AddressFormSchemaType; isValid: boolean };
  };
};

const initialState: CheckoutStore = {
  shippingAddress: {
    mode: 'select',
    inputForm: {
      isValid: false,
      values: {
        address: '',
        city: '',
        country: '',
        phone: '',
        type: 'not-relevant',
        label: '',
      },
    },
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
