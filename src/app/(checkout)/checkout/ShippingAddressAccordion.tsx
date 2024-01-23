'use client';

import { AddressSelect } from '@/lib/db/schema/address';
import ShippingAddressInput from './ShippingAddressInput';
import ShippingAddressSelect from './ShippingAddressSelect';
import { Root as AccordionRoot } from '@radix-ui/react-accordion';
import { useCheckoutStore } from '@/lib/store/checkout-store';

const ShippingAddressAccordion = ({
  savedAddresses,
}: {
  savedAddresses: AddressSelect[];
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
          console.log(shippingAddressMode, 'CURRENT SHIPPING ADDRESS MODE');
        }}
      >
        <ShippingAddressSelect savedAddresses={savedAddresses} />
        <ShippingAddressInput />
      </AccordionRoot>
    </div>
  );
};
export default ShippingAddressAccordion;
