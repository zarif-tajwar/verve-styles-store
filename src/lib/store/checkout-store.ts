import { UseFormGetValues, UseFormTrigger } from 'react-hook-form';
import { create } from 'zustand';
import { UserAddress } from '../types/user';
import { AddressFormSchemaType } from '../validation/address-form';

type CheckoutStoreAction = {
  setShippingAdressMode: (
    mode: CheckoutStore['shippingAddress']['mode'],
  ) => void;
  setAddressInputFormTrigger: (
    addressInputFormTrigger: UseFormTrigger<AddressFormSchemaType>,
  ) => void;
  setIsAddressFormDataValid: (isValid: boolean) => void;
  setAddressFormDataGetter: (
    dataGetter: UseFormGetValues<AddressFormSchemaType>,
  ) => void;
  setAddressId: (addressId: UserAddress['id']) => void;
};

type CheckoutStore = {
  shippingAddress: {
    mode: 'input' | 'select';
    inputForm: {
      isValid: boolean;
      dataGetter: UseFormGetValues<AddressFormSchemaType> | undefined;
      addressInputFormTrigger:
        | UseFormTrigger<AddressFormSchemaType>
        | undefined;
    };
    select: { addressId: UserAddress['id'] | undefined };
  };
};

const initialState: CheckoutStore = {
  shippingAddress: {
    mode: 'select',
    inputForm: {
      isValid: false,
      dataGetter: undefined,
      addressInputFormTrigger: undefined,
    },
    select: { addressId: undefined },
  },
};

export const useCheckoutStore = create<CheckoutStore & CheckoutStoreAction>()(
  (set) => ({
    ...initialState,
    setShippingAdressMode: (mode) => {
      set((state) => {
        return {
          shippingAddress: { ...state.shippingAddress, mode },
        };
      });
    },
    setAddressInputFormTrigger: (trigger) => {
      set((state) => {
        return {
          shippingAddress: {
            ...state.shippingAddress,
            inputForm: {
              ...state.shippingAddress.inputForm,
              addressInputFormTrigger: trigger,
            },
          },
        };
      });
    },
    setIsAddressFormDataValid: (isValid) => {
      set((state) => {
        return {
          shippingAddress: {
            ...state.shippingAddress,
            inputForm: { ...state.shippingAddress.inputForm, isValid },
          },
        };
      });
    },
    setAddressFormDataGetter: (dataGetter) => {
      set((state) => {
        return {
          shippingAddress: {
            ...state.shippingAddress,
            inputForm: { ...state.shippingAddress.inputForm, dataGetter },
          },
        };
      });
    },
    setAddressId: (addressId) => {
      set((state) => {
        return {
          shippingAddress: {
            ...state.shippingAddress,
            select: { ...state.shippingAddress.select, addressId },
          },
        };
      });
    },
  }),
);
