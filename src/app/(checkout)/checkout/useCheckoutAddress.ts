'use client';

import { errorToast, successToast } from '@/components/UI/Toaster';
import { PerformCheckoutSchemaType } from '@/lib/actions/checkout';
import { CustomError } from '@/lib/errors/custom-error';
import { useCheckoutStore } from '@/lib/store/checkout-store';
import { useShallow } from 'zustand/react/shallow';

export const useCheckoutAddress = () => {
  const trigger = useCheckoutStore(
    useShallow(
      (store) => store.shippingAddress.inputForm.addressInputFormTrigger,
    ),
  );
  const isValid = useCheckoutStore(
    useShallow((store) => store.shippingAddress.inputForm.isValid),
  );
  const dataGetter = useCheckoutStore(
    (store) => store.shippingAddress.inputForm.dataGetter,
  );
  const shippingAddressMode = useCheckoutStore(
    (store) => store.shippingAddress.mode,
  );
  const addressId = useCheckoutStore(
    (store) => store.shippingAddress.select.addressId,
  );

  const getCheckoutAddress = ():
    | PerformCheckoutSchemaType['shippingAddress']
    | undefined => {
    if (shippingAddressMode === 'select') {
      if (!addressId) {
        errorToast('An invalid address was selected', {
          description: 'Please choose some other address option',
        });
        return;
      }
      return { mode: 'select', addressId };
    }

    if (shippingAddressMode === 'input') {
      if (!trigger || !dataGetter) {
        errorToast('Something went wrong with the address form', {
          description: 'Please try again',
        });
        return;
      }
      if (!isValid) {
        trigger();
        return;
      }
      const values = dataGetter();
      return { mode: 'input', values };
    }

    return;
  };

  return {
    getCheckoutAddress,
  };
};
