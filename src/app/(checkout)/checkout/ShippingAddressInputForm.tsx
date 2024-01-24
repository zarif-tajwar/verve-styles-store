'use client';

import AddressInputForm, {
  AddressInputFormFields,
} from '@/app/(root)/(user)/my-account/addresses/AddressInputForm';
import { useCheckoutStore } from '@/lib/store/checkout-store';
import {
  AddressFormSchema,
  AddressFormSchemaType,
} from '@/lib/validation/address-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { useShallow } from 'zustand/react/shallow';

const ShippingAddressInputForm = ({
  savedAddressesLength,
  className,
}: {
  savedAddressesLength?: number;
  className?: string;
}) => {
  const form = useForm<AddressFormSchemaType>({
    resolver: zodResolver(AddressFormSchema),
    mode: 'all',
  });
  const { handleSubmit, control, watch, formState, trigger, getValues } = form;
  const setAddressInputFormTrigger = useCheckoutStore(
    (store) => store.setAddressInputFormTrigger,
  );
  const setIsAddressFormDataValid = useCheckoutStore(
    (store) => store.setIsAddressFormDataValid,
  );
  const setDataGetter = useCheckoutStore(
    (store) => store.setAddressFormDataGetter,
  );

  const setShippingAddressMode = useCheckoutStore(
    (store) => store.setShippingAdressMode,
  );

  const isValid = formState.isValid;

  useEffect(() => {
    if (savedAddressesLength === 0) {
      setShippingAddressMode('input');
    }
  }, []);

  useEffect(() => {
    console.log(isValid, 'IS FORM VALID');
    setIsAddressFormDataValid(isValid);
  }, [isValid, setIsAddressFormDataValid]);

  useEffect(() => {
    setAddressInputFormTrigger(trigger);
    console.log('SET TRIGGER RERENDERED');
  }, [trigger, setAddressInputFormTrigger]);

  useEffect(() => {
    setDataGetter(getValues);
  }, [getValues, setDataGetter]);

  // useEffect(() => {
  //   const subscribtion = watch((value, { name, type }) => {
  //     console.log(value, name, type, 'SUBSCRIPTION');
  //   });
  //   return () => subscribtion.unsubscribe();
  // }, [watch]);

  const onSubmit = async (values: AddressFormSchemaType) => {};

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={className}>
      <AddressInputFormFields formHookObject={form} />
    </form>
  );
};
// const ShippingAddressInputForm = ({ className }: { className?: string }) => {
//   return <AddressInputForm removeSaveButton className={className} />;
// };
export default ShippingAddressInputForm;
