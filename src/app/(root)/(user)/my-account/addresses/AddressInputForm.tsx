'use client';

import * as React from 'react';
import { Input } from '@/components/UI/Input';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectValue,
  SelectItem,
} from '@/components/UI/Select';
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
import Spinner from '@/components/UI/Spinner';
import { cn, wait } from '@/lib/util';

export type AddressInputFormProps =
  React.FormHTMLAttributes<HTMLFormElement> & {
    removeSaveButton?: boolean;
    previousValues?: AddressFormSchemaType | undefined;
    afterFormSubmit?: (values: AddressFormSchemaType) => any;
    saveText?: string;
  };

const AddressInputForm = React.forwardRef<
  HTMLFormElement,
  AddressInputFormProps
>(
  (
    { removeSaveButton, previousValues, afterFormSubmit, saveText, ...props },
    ref,
  ) => {
    const formHookObject = useForm<AddressFormSchemaType>({
      resolver: zodResolver(AddressFormSchema),
      defaultValues: previousValues,
    });

    const { isSubmitting, isDirty } = formHookObject.formState;

    const handleSubmit = async (values: AddressFormSchemaType) => {
      await afterFormSubmit?.(values);
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
              className="min-w-24 gap-1.5"
              disabled={isSubmitting || !isDirty}
            >
              {isSubmitting && (
                <>
                  <Spinner size={16} />
                  {'Saving'}
                </>
              )}
              {!isSubmitting && (
                <>
                  <SaveIcon className="size-4" />
                  {saveText ?? 'Save'}
                </>
              )}
            </Button>
          </div>
        )}
      </form>
    );
  },
);

AddressInputForm.displayName = 'AddressInputForm';

export default AddressInputForm;

interface AddressInputFormFieldsProps
  extends React.HTMLAttributes<HTMLDivElement> {
  formHookObject: UseFormReturn<AddressFormSchemaType>;
}

const addressTypeOptions: {
  type: AddressFormSchemaType['type'];
  icon: typeof HomeIcon;
}[] = [
  { type: 'home', icon: HomeIcon },
  { type: 'office', icon: BriefcaseIcon },
  { type: 'not-relevant', icon: HashtagIcon },
];

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
    <div ref={ref} className="@container">
      <div className="grid grid-cols-1 gap-4 @md:grid-cols-2 @xl:gap-8">
        <div className="flex flex-col gap-1">
          <Label
            required={true}
            htmlFor="address"
            className="w-max text-sm font-medium @xl:text-base @xl:font-normal"
          >
            Your Address
          </Label>
          <Input
            {...register('address', { required: 'Address is required!' })}
            type="text"
            id="address"
            placeholder="Enter your address"
            className="h-8 rounded-md px-2 py-1 @xl:h-9 @xl:rounded-lg @xl:px-3 @xl:py-2"
          />
          {errors.address?.message && (
            <p className="absolute -bottom-0.5 left-3 translate-y-full text-sm text-rose-700">
              {errors.address.message}
            </p>
          )}
        </div>
        <div className="flex flex-col gap-1">
          <Label
            htmlFor="city"
            className="w-max text-sm font-medium @xl:text-base @xl:font-normal"
          >
            City
          </Label>
          <Input
            type="text"
            {...register('city', { required: 'City is required!' })}
            id="city"
            placeholder="Enter your city"
            className="h-8 rounded-md px-2 py-1 @xl:h-9 @xl:rounded-lg @xl:px-3 @xl:py-2"
          />
          {errors.city?.message && (
            <p className="absolute -bottom-0.5 left-3 translate-y-full text-sm text-rose-700">
              {errors.city.message}
            </p>
          )}
        </div>
        <div className="flex flex-col gap-1">
          <Label
            htmlFor="country"
            className="w-max text-sm font-medium @xl:text-base @xl:font-normal"
          >
            Country
          </Label>
          <Input
            {...register('country', { required: 'Country is required!' })}
            type="text"
            id="country"
            placeholder="Enter your country"
            className="h-8 rounded-md px-2 py-1 @xl:h-9 @xl:rounded-lg @xl:px-3 @xl:py-2"
          />
          {errors.country?.message && (
            <p className="absolute -bottom-0.5 left-3 translate-y-full text-sm text-rose-700">
              {errors.country.message}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <Label
            htmlFor="phone"
            className="w-max text-sm font-medium @xl:text-base @xl:font-normal"
          >
            Phone
          </Label>
          <Input
            type="text"
            id="phone"
            {...register('phone', { required: 'Phone Number is required!' })}
            placeholder="Example: +880 19xxxxxxxxx"
            className="h-8 rounded-md px-2 py-1 @xl:h-9 @xl:rounded-lg @xl:px-3 @xl:py-2"
          />
          {errors.phone?.message && (
            <p className="absolute -bottom-0.5 left-3 translate-y-full text-sm text-rose-700">
              {errors.phone.message}
            </p>
          )}
        </div>
        <div className="flex flex-col gap-1">
          <Label
            required={false}
            htmlFor="address-label"
            className="w-max text-sm font-medium @xl:text-base @xl:font-normal"
          >
            Address Label
          </Label>
          <Input
            type="text"
            id="address-label"
            placeholder="Name this address"
            className="h-8 rounded-md px-2 py-1 @xl:h-9 @xl:rounded-lg @xl:px-3 @xl:py-2"
            {...register('label', {
              required: false,
              setValueAs: (value) => {
                if (value === '') return undefined;
                return value;
              },
            })}
          />
          {errors.label?.message && (
            <p className="absolute -bottom-0.5 left-3 translate-y-full text-sm text-rose-700">
              {errors.label.message}
            </p>
          )}
        </div>
        <div className="relative flex flex-col gap-1">
          <Label
            htmlFor="addressType"
            required={false}
            className="w-max text-sm font-medium @xl:text-base @xl:font-normal"
          >
            Address Type
          </Label>
          <Controller
            name="type"
            control={control}
            render={({ field }) => {
              return (
                <Select onValueChange={field.onChange} {...field}>
                  <SelectTrigger
                    className={cn(
                      'bg-primary-50 py-1 font-normal shadow-none ring-0 data-[placeholder]:text-primary-300',
                      'min-h-8 rounded-md px-2 py-1 @xl:h-9 @xl:rounded-lg @xl:px-3 @xl:py-2',
                      'focus:ring-2 focus:ring-primary-400',
                    )}
                  >
                    <SelectValue
                      placeholder="Select address type"
                      className={cn()}
                    />
                  </SelectTrigger>
                  <SelectContent position="item-aligned" className="">
                    {addressTypeOptions.map((option) => {
                      return (
                        <SelectItem
                          className="pl-1.5"
                          key={option.type}
                          value={option.type}
                        >
                          <span className="inline-flex items-center gap-2 capitalize">
                            <option.icon className="size-4 text-primary-400" />
                            {option.type}
                          </span>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              );
            }}
          />
        </div>
      </div>
    </div>
  );
});

AddressInputFormFields.displayName = 'AddressInputFormFields';
