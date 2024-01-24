'use client';

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

  return { trigger, isValid, dataGetter, shippingAddressMode, addressId };
};
