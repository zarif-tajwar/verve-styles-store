'use client';

import AddressInputForm from '@/app/(root)/(user)/my-account/addresses/AddressInputForm';
import { useCheckoutStore } from '@/lib/store/checkout-store';
import { useShallow } from 'zustand/react/shallow';

const ShippingAddressInput = () => {
  const mode = useCheckoutStore(
    useShallow((store) => store.shippingAddress.mode),
  );
  const isActive = mode === 'input';
  const setMode = useCheckoutStore((store) => store.setShippingAdressMode);
  return (
    <div
      className="rounded-xl px-6 py-6 shadow-sm"
      onClick={() => setMode('input')}
    >
      <div className="mb-5">
        <h3 className="text-lg font-semibold">Input Address</h3>
        <p className="text-sm text-primary-500">Enter a different address</p>
      </div>
      <AddressInputForm removeSaveButton />
    </div>
  );
};
export default ShippingAddressInput;
