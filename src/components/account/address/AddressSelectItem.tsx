import { UserAddress } from '@/lib/types/user';

const AddressSelectItem = ({ address }: { address: UserAddress }) => {
  return (
    <div className="relative text-sm">
      <div className="mb-4 flex items-center gap-2 text-sm leading-none sm:text-base">
        <p className="font-semibold text-primary-400">{address.label}</p>
        {address.isDefault && (
          <span className="text-sm font-medium text-primary-300">
            (DEFAULT)
          </span>
        )}
      </div>
      <dl className="grid w-full gap-x-8 gap-y-2 font-medium text-primary-500 [@media(width>460px)]:grid-cols-2">
        <div className="space-y-1">
          <dd className="text-primary-400 opacity-90">Address</dd>
          <dt className="font-medium">{address.address}</dt>
        </div>
        <div className="space-y-1">
          <dd className="text-primary-400 opacity-90">City</dd>
          <dt className="font-medium">{address.city}</dt>
        </div>
        <div className="space-y-1">
          <dd className="text-primary-400 opacity-90">Country</dd>
          <dt className="font-medium">{address.country}</dt>
        </div>
        <div className="space-y-1">
          <dd className="text-primary-400 opacity-90">Phone</dd>
          <dt className="font-medium">{address.phone}</dt>
        </div>
      </dl>
    </div>
  );
};
export default AddressSelectItem;
