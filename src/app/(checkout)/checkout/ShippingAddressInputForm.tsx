'use client';

import AddressInputForm from '@/app/(root)/(user)/my-account/addresses/AddressInputForm';

const ShippingAddressInputForm = ({ className }: { className?: string }) => {
  return <AddressInputForm removeSaveButton className={className} />;
};
export default ShippingAddressInputForm;
