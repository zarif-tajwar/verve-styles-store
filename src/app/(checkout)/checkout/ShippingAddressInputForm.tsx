'use client';

import { AddressInputFormFields } from '@/app/(root)/(user)/my-account/addresses/AddressInputForm';
import { useCheckoutStore } from '@/lib/store/checkout-store';
import { cn } from '@/lib/util';
import {
  AddressFormSchema,
  AddressFormSchemaType,
} from '@/lib/validation/address-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

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
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    setIsAddressFormDataValid(isValid);
  }, [isValid, setIsAddressFormDataValid]);

  useEffect(() => {
    setAddressInputFormTrigger(trigger);
  }, [trigger, setAddressInputFormTrigger]);

  useEffect(() => {
    setDataGetter(getValues);
  }, [getValues, setDataGetter]);

  const onSubmit = async (values: AddressFormSchemaType) => {};

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={cn('p-1', className)}>
      <AddressInputFormFields formHookObject={form} />
    </form>
  );
};
export default ShippingAddressInputForm;
