import AddressInputForm from '@/app/(root)/(user)/my-account/addresses/AddressInputForm';
import ShippingAddressSelect from './ShippingAddressSelect';
import ShippingAddressInput from './ShippingAddressInput';
import { getSavedAddressesServer } from '@/lib/actions/address';
import ShippingAddressAccordion from './ShippingAddressAccordion';

const ShippingAddress = async () => {
  const savedAddresses = (await getSavedAddressesServer()) ?? [];
  return (
    <div>
      <div className="mb-8 space-y-1">
        <h2 className="text-2xl font-semibold">Shipping Address</h2>
        <p className="text-primary-400">
          Fillup your Shipping Address your payment details and make payment
        </p>
      </div>
      <div className="max-w-lg">
        <ShippingAddressAccordion savedAddresses={savedAddresses} />
      </div>
    </div>
  );
};
export default ShippingAddress;
