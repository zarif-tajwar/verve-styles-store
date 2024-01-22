'use client';

import { useCheckoutStore } from '@/lib/store/checkout-store';
import { useShallow } from 'zustand/react/shallow';
import { cn } from '@/lib/util';

const ShippingAddressSelect = () => {
  const mode = useCheckoutStore(
    useShallow((store) => store.shippingAddress.mode),
  );
  const setMode = useCheckoutStore((store) => store.setShippingAdressMode);
  const isActive = mode === 'select';

  return (
    <div
      className="relative rounded-xl px-6 py-6 shadow-sm"
      onClick={() => setMode('select')}
    >
      <div className="mb-5">
        <h3 className="text-lg font-semibold">Saved Addresses</h3>
        <p className="text-sm text-primary-500">
          Choose from your saved addresses
        </p>
      </div>
    </div>
  );
};
export default ShippingAddressSelect;
