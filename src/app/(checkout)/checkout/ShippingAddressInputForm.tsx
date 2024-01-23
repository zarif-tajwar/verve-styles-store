'use client';

import AddressInputForm, {
  AddressInputFormFields,
} from '@/app/(root)/(user)/my-account/addresses/AddressInputForm';
import {
  AddressFormSchema,
  AddressFormSchemaType,
} from '@/lib/validation/address-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

const ShippingAddressInputForm = () => {
  const form = useForm<AddressFormSchemaType>({
    resolver: zodResolver(AddressFormSchema),
    mode: 'onBlur',
  });

  const handleSubmit = async (values: AddressFormSchemaType) => {};

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="px-6 pb-6">
      <AddressInputFormFields formHookObject={form} />
    </form>
  );
};
// const ShippingAddressInputForm = ({ className }: { className?: string }) => {
//   return <AddressInputForm removeSaveButton className={className} />;
// };
export default ShippingAddressInputForm;
