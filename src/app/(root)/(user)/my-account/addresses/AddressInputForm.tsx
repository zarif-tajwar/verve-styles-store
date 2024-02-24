'use client';

import { SaveIcon } from '@/components/Svgs/icons';
import { Button } from '@/components/UI/Button';
import { Input } from '@/components/UI/Input';
import { Label } from '@/components/UI/Label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/UI/Select';
import Spinner from '@/components/UI/Spinner';
import { cn } from '@/lib/util';
import {
  AddressFormSchema,
  AddressFormSchemaType,
} from '@/lib/validation/address-form';
import {
  BriefcaseIcon,
  HashtagIcon,
  HomeIcon,
} from '@heroicons/react/16/solid';
import { zodResolver } from '@hookform/resolvers/zod';
import { AnimatePresence, motion } from 'framer-motion';
import * as React from 'react';
import { Controller, UseFormReturn, useForm } from 'react-hook-form';

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
          <div className="flex justify-end pt-8 sm:pt-10 md:pt-12">
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
  text: string;
}[] = [
  { type: 'home', icon: HomeIcon, text: 'Home' },
  { type: 'office', icon: BriefcaseIcon, text: 'Office' },
  { type: 'not-relevant', icon: HashtagIcon, text: 'Not relevant' },
];

export const AddressInputFormFields = React.forwardRef<
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
        <div className="relative flex flex-col gap-1">
          <Label
            required={true}
            htmlFor="address"
            className="w-max text-sm font-medium text-primary-400 @xl:text-base"
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
          <InputErrorMessage
            key="address-message"
            message={errors.address?.message}
          />
        </div>
        <div className="relative flex flex-col gap-1">
          <Label
            htmlFor="city"
            className="w-max text-sm font-medium text-primary-400 @xl:text-base"
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
          <InputErrorMessage
            key="city-message"
            message={errors.city?.message}
          />
        </div>
        <div className="relative flex flex-col gap-1">
          <Label
            htmlFor="country"
            className="w-max text-sm font-medium text-primary-400 @xl:text-base"
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
          <InputErrorMessage
            key="country-message"
            message={errors.country?.message}
          />
        </div>

        <div className="relative flex flex-col gap-1">
          <Label
            htmlFor="phone"
            className="w-max text-sm font-medium text-primary-400 @xl:text-base"
          >
            Phone
          </Label>
          <Input
            type="text"
            id="phone"
            {...register('phone', {
              required: 'Phone Number is required!',
            })}
            placeholder="Example: +880 19xxxxxxxxx"
            className="h-8 rounded-md px-2 py-1 @xl:h-9 @xl:rounded-lg @xl:px-3 @xl:py-2"
          />
          <InputErrorMessage
            key="phone-message"
            message={errors.phone?.message}
          />
        </div>
        <div className="relative flex flex-col gap-1">
          <Label
            required={false}
            htmlFor="address-label"
            className="w-max text-sm font-medium text-primary-400 @xl:text-base"
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
          <InputErrorMessage
            key="label-message"
            message={errors.label?.message}
          />
        </div>
        <div className="relative flex flex-col gap-1">
          <Label
            htmlFor="addressType"
            required={false}
            className="w-max text-sm font-medium text-primary-400 @xl:text-base"
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
                          <span className="inline-flex items-center gap-2">
                            <option.icon className="size-4 text-primary-400" />
                            {option.text}
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

const InputErrorMessage = ({
  message,
  key,
}: {
  message: string | undefined;
  key: string;
}) => {
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{
            height: 'auto',
            opacity: 1,
            transition: { ease: 'easeOut', duration: 0.2 },
          }}
          exit={{
            height: 0,
            opacity: 0,
            transition: { ease: 'easeIn', duration: 0.2 },
          }}
          key={key}
          className="overflow-hidden"
        >
          <p className="text-sm font-medium text-red-700">{message}</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
