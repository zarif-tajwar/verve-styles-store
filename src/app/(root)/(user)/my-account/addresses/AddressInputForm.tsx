'use client';

import * as React from 'react';
import { Input } from '@/components/UI/Input';
import { Select } from '@/components/UI/Select';
import * as RadioGroup from '@radix-ui/react-radio-group';
import {
  HashtagIcon,
  HomeIcon,
  BriefcaseIcon,
} from '@heroicons/react/16/solid';
import { Label } from '@/components/UI/Label';
import { useForm, Controller, UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  AddressFormSchema,
  AddressFormSchemaType,
} from '@/lib/validation/address-form';
import { Button } from '@/components/UI/Button';
import { SaveIcon } from '@/components/Svgs/icons';

type AddressInputFormProps = React.FormHTMLAttributes<HTMLFormElement> & {
  removeSaveButton?: boolean;
  previousValues?: AddressFormSchemaType | undefined;
  afterFormSubmit?: (values: AddressFormSchemaType) => any;
};

const AddressInputForm = React.forwardRef<
  HTMLFormElement,
  AddressInputFormProps
>(({ removeSaveButton, previousValues, afterFormSubmit, ...props }, ref) => {
  const formHookObject = useForm<AddressFormSchemaType>({
    resolver: zodResolver(AddressFormSchema),
    defaultValues: previousValues,
  });

  const handleSubmit = async (values: AddressFormSchemaType) => {
    console.log(values);
    afterFormSubmit?.(values);
  };

  return (
    <form
      {...props}
      ref={ref}
      onSubmit={formHookObject.handleSubmit(handleSubmit)}
    >
      <AddressInputFormFields formHookObject={formHookObject} />
      {!removeSaveButton && (
        <div className="flex justify-end pt-12">
          <Button
            type="submit"
            roundness={'lg'}
            align={'left'}
            className="min-w-24 gap-1.5"
          >
            <SaveIcon className="size-4" />
            Save
          </Button>
        </div>
      )}
    </form>
  );
});

AddressInputForm.displayName = 'AddressInputForm';

export default AddressInputForm;

interface AddressInputFormFieldsProps
  extends React.HTMLAttributes<HTMLDivElement> {
  formHookObject: UseFormReturn<AddressFormSchemaType>;
}

const AddressInputFormFields = React.forwardRef<
  HTMLDivElement,
  AddressInputFormFieldsProps
>(({ formHookObject }, ref) => {
  const {
    register,
    formState: { errors },
    control,
  } = formHookObject;
  return (
    <div ref={ref} className="grid grid-cols-2 gap-8">
      <div className="relative grid gap-1">
        <Label required={true} htmlFor="address" className="w-max">
          Your Address
        </Label>
        <Input
          {...register('address', { required: 'Address is required!' })}
          type="text"
          id="address"
          placeholder="Enter your address"
        />
        {errors.address?.message && (
          <p className="absolute -bottom-0.5 left-3 translate-y-full text-sm text-rose-700">
            {errors.address.message}
          </p>
        )}
      </div>
      <div className="relative grid gap-1">
        <Label htmlFor="country" className="w-max">
          Country
        </Label>
        <Input
          {...register('country', { required: 'Country is required!' })}
          type="text"
          id="country"
          placeholder="Enter your country"
        />
        {errors.country?.message && (
          <p className="absolute -bottom-0.5 left-3 translate-y-full text-sm text-rose-700">
            {errors.country.message}
          </p>
        )}
      </div>
      <div className="relative grid gap-1">
        <Label htmlFor="city" className="w-max">
          City
        </Label>
        <Input
          type="text"
          {...register('city', { required: 'City is required!' })}
          id="city"
          placeholder="Enter your city"
        />
        {errors.city?.message && (
          <p className="absolute -bottom-0.5 left-3 translate-y-full text-sm text-rose-700">
            {errors.city.message}
          </p>
        )}
      </div>
      <div className="relative grid gap-1">
        <Label htmlFor="phone" className="w-max">
          Phone
        </Label>
        <Input
          type="text"
          id="phone"
          {...register('phone', { required: 'Phone Number is required!' })}
          placeholder="Enter your phone number"
        />
        {errors.phone?.message && (
          <p className="absolute -bottom-0.5 left-3 translate-y-full text-sm text-rose-700">
            {errors.phone.message}
          </p>
        )}
      </div>
      <div className="relative grid gap-1">
        <Label required={false} htmlFor="address-label" className="w-max">
          Address Label
        </Label>
        <Input
          type="text"
          id="address-label"
          placeholder="Name this address"
          {...register('label')}
        />
        {errors.label?.message && (
          <p className="absolute -bottom-0.5 left-3 translate-y-full text-sm text-rose-700">
            {errors.label.message}
          </p>
        )}
      </div>
      <div className="relative flex flex-col gap-1">
        <Label htmlFor="addressType" required={false}>
          Choose Address Type
        </Label>
        <Controller
          name="addressType"
          control={control}
          render={({ field }) => {
            return (
              <RadioGroup.Root
                onValueChange={field.onChange}
                {...field}
                id="addressType"
              >
                <div className="flex items-start gap-2 text-sm">
                  <label
                    htmlFor="not-relevant"
                    className="inline-flex cursor-pointer items-center rounded-md bg-primary-50 px-2 py-1 has-[:checked]:bg-primary-500 has-[:checked]:text-primary-0"
                  >
                    <RadioGroup.Item value="not-relevant" id="not-relevant" />
                    <span className="inline-flex items-center gap-1">
                      <HashtagIcon className="-ml-0.5 size-4" />
                      Not relevant
                    </span>
                  </label>
                  <label
                    htmlFor="home"
                    className="inline-flex cursor-pointer items-center rounded-md bg-primary-50 px-2 py-1 has-[:checked]:bg-primary-500 has-[:checked]:text-primary-0"
                  >
                    <RadioGroup.Item value="home" id="home" />
                    <span className="inline-flex items-center gap-1">
                      <HomeIcon className="-ml-0.5 size-4" />
                      Home
                    </span>
                  </label>
                  <label
                    htmlFor="office"
                    className="inline-flex cursor-pointer items-center rounded-md bg-primary-50 px-2 py-1 has-[:checked]:bg-primary-500 has-[:checked]:text-primary-0"
                  >
                    <RadioGroup.Item value="office" id="office" />
                    <span className="inline-flex items-center gap-1">
                      <BriefcaseIcon className="-ml-0.5 size-4" />
                      Office
                    </span>
                  </label>
                </div>
              </RadioGroup.Root>
            );
          }}
        />
      </div>
    </div>
  );
});

AddressInputFormFields.displayName = 'AddressInputFormFields';
