import { getSavedAddressesServer } from '@/lib/server/address';
import ShippingAddressInputForm from './ShippingAddressInputForm';
import ShippingAddressRadio from './ShippingAddressRadio';

const ShippingAddress = async () => {
  const savedAddresses = (await getSavedAddressesServer()) ?? [];
  const savedAddressesLength = savedAddresses.length;
  return (
    <div className="rounded-main border border-primary-100 p-6 xl:p-8">
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
