import { getSavedAddressesServer } from '@/lib/actions/address';
import ShippingAddressAccordion from './ShippingAddressAccordion';
import AddressInputForm from '@/app/(root)/(user)/my-account/addresses/AddressInputForm';
import ShippingAddressInputForm from './ShippingAddressInputForm';

const ShippingAddress = async () => {
  const savedAddresses = (await getSavedAddressesServer()) ?? [];
  const savedAddressesLength = savedAddresses.length;
  return (
    <div className="max-w-lg">
      <div className="mb-4 space-y-1">
        <h2 className="text-2xl font-semibold">Shipping Address</h2>
        <p className="max-w-sm text-primary-400">
          {savedAddresses.length === 0
            ? 'Tell us where to send the delivery'
            : 'Choose an address from your saved addresses or input a different one'}
        </p>
      </div>
      <div className="">
        {savedAddresses.length > 0 ? (
          <ShippingAddressAccordion savedAddresses={savedAddresses} />
        ) : (
          <ShippingAddressInputForm
            savedAddressesLength={savedAddressesLength}
          />
        )}
      </div>
    </div>
  );
};
export default ShippingAddress;
