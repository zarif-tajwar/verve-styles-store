import { DateRange } from 'react-day-picker';
import { create } from 'zustand';
import { AddressFormSchemaType } from '../validation/address-form';
import { UseFormGetValues, UseFormTrigger } from 'react-hook-form';
import { AddressSelect } from '../db/schema/address';

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
  setAddressId: (addressId: AddressSelect['id']) => void;
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
    select: { addressId: AddressSelect['id'] | undefined };
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
