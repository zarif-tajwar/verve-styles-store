import { getSavedAddressesServer } from '@/lib/actions/address';
import ShippingAddressAccordion from './ShippingAddressAccordion';
import AddressInputForm from '@/app/(root)/(user)/my-account/addresses/AddressInputForm';
import ShippingAddressInputForm from './ShippingAddressInputForm';
import ShippingAddressRadio from './ShippingAddressRadio';

const ShippingAddress = async () => {
  const savedAddresses = (await getSavedAddressesServer()) ?? [];
  const savedAddressesLength = savedAddresses.length;
  return (
    <div className="rounded-main border-2 border-primary-50 p-6 xl:p-8">
      <div className="mb-8 space-y-1">
        <h2 className="text-xl font-semibold sm:text-2xl">Shipping Address</h2>
        <p className="max-w-sm text-primary-400">
          {savedAddresses.length === 0
            ? 'Tell us where to send the delivery'
            : 'Choose an address from your saved addresses or input a different one'}
        </p>
      </div>
      <div className="">
        {savedAddresses.length > 0 ? (
          // <ShippingAddressAccordion savedAddresses={savedAddresses} />
          <ShippingAddressRadio savedAddresses={savedAddresses} />
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
