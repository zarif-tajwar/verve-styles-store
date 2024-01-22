import AddressInputForm from '@/app/(root)/(user)/my-account/addresses/AddressInputForm';
import ShippingAddressSelect from './ShippingAddressSelect';
import ShippingAddressInput from './ShippingAddressInput';

const ShippingAddress = () => {
  return (
    <div>
      <div className="mb-8 space-y-1">
        <h2 className="text-2xl font-semibold">Shipping Address</h2>
        <p className="text-primary-400">
          Fillup your Shippinh Address your payment details and make payment
        </p>
      </div>
      <div className="max-w-lg space-y-4">
        <ShippingAddressSelect />
        <ShippingAddressInput />
      </div>
    </div>
  );
};
export default ShippingAddress;
