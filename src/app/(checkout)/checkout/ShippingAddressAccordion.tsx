'use client';

import { useCheckoutStore } from '@/lib/store/checkout-store';
import { UserAddress } from '@/lib/types/user';
import { Root as AccordionRoot } from '@radix-ui/react-accordion';
import ShippingAddressInput from './ShippingAddressInput';
import ShippingAddressSelect from './ShippingAddressSelect';

const ShippingAddressAccordion = ({
  savedAddresses,
}: {
  savedAddresses: UserAddress[];
}) => {
  const setShippingAddressMode = useCheckoutStore(
    (store) => store.setShippingAdressMode,
  );
  const shippingAddressMode = useCheckoutStore(
    (store) => store.shippingAddress.mode,
  );
  return (
    <div>
      <AccordionRoot
        type="single"
        className="space-y-8"
        value={shippingAddressMode}
        onValueChange={(value) => {
          if (value === 'select') {
            setShippingAddressMode(value);
          }
          if (value === 'input') {
            setShippingAddressMode(value);
          }
        }}
      >
        <ShippingAddressSelect savedAddresses={savedAddresses} />
        <ShippingAddressInput />
      </AccordionRoot>
    </div>
  );
};
export default ShippingAddressAccordion;
