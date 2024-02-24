'use client';

import { SaveIcon } from '@/components/Svgs/icons';
import { Button } from '@/components/UI/Button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/UI/Dialog';
import Spinner from '@/components/UI/Spinner';
import { errorToast, successToast } from '@/components/UI/Toaster';
import { changeDefaultAddressAction } from '@/lib/actions/address';
import { useAddressesQuery } from '@/lib/hooks/useAddressQuery';
import { cn } from '@/lib/util';
import {
  DefaultAddressFormSchema,
  DefaultAddressFormSchemaType,
} from '@/lib/validation/address-form';
import { LinkIcon } from '@heroicons/react/16/solid';
import { zodResolver } from '@hookform/resolvers/zod';
import * as RadioGroup from '@radix-ui/react-radio-group';
// import * as ScrollArea from '@radix-ui/react-scroll-area';
import { ScrollArea } from '@/components/UI/ScrollArea';
import { useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { useAction } from 'next-safe-action/hooks';
import React, { useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { CheckCircleIcon } from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleIconSolid } from '@heroicons/react/24/solid';
import { AddressItem } from '@/app/(checkout)/checkout/ShippingAddressSelect';

const ChangeDefaultAddress = () => {
  const session = useSession();
  const addressesQuery = useAddressesQuery(session.data ?? undefined);
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { execute } = useAction(changeDefaultAddressAction, {
    onSuccess: async ({ success }) => {
      await queryClient.refetchQueries({ queryKey: ['addresses'] });
      setIsDialogOpen(false);
      successToast(success);
    },
    onError: (errors) => {
      if (errors.serverError) {
        errorToast('Failed', { description: errors.serverError });
      }
      if (errors.fetchError) {
        errorToast('Failed', { description: errors.fetchError });
      }
    },
  });

  const addresses = addressesQuery.data?.data;

  const selectedValue = useMemo(
    () => addresses?.find((address) => address.isDefault)?.id,
    [addresses],
  );

  // TODO: Proper handling of form dirty state

  const { formState, control, handleSubmit } =
    useForm<DefaultAddressFormSchemaType>({
      resolver: zodResolver(DefaultAddressFormSchema),
      ...(selectedValue ? { values: { addressId: selectedValue } } : {}),
    });

  const { isSubmitting, isDirty } = formState;

  const onSubmit = async (value: DefaultAddressFormSchemaType) => {
    await execute({ addressId: value.addressId });
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button
          variant={'default'}
          roundness={'default'}
          className="gap-1.5 bg-primary-500 hover:bg-primary-400"
        >
          <LinkIcon className="-ml-0.5 size-4" />
          Change Default Address
        </Button>
      </DialogTrigger>
      <DialogContent
        onOpenAutoFocus={(e) => e.preventDefault()}
        className="p-6 sm:max-w-xl sm:p-8"
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <div className="relative mb-4 sm:mb-6 md:mb-8">
              <h2 className="mb-1 text-lg font-semibold sm:text-xl">
                Change Default Address
              </h2>
              <p className="text-balance text-sm text-primary-400 sm:text-base">{`Select your default address here. Click Save Changes when you're finished.`}</p>
            </div>
            <div className="mb-4 w-full rounded-xl border border-primary-100 sm:mb-6">
              <ScrollArea scrollBarClassName="w-2" className="h-[300px] w-full">
                {addresses && (
                  <Controller
                    control={control}
                    name="addressId"
                    render={({ field }) => {
                      return (
                        <RadioGroup.Root
                          onValueChange={field.onChange}
                          {...field}
                          value={field.value?.toString()}
                        >
                          <div className="grid px-4">
                            {addresses.map((address) => {
                              return (
                                <React.Fragment key={address.id}>
                                  <label
                                    htmlFor={address.id.toString()}
                                    className="grid cursor-pointer grid-cols-[1.5rem_auto] gap-x-2.5 py-4"
                                  >
                                    <RadioGroup.Item
                                      value={address.id.toString()}
                                      className="group flex flex-col justify-start"
                                      id={address.id.toString()}
                                    >
                                      <CheckCircleIcon className="size-6 text-primary-100 group-data-[state=checked]:hidden" />
                                      <CheckCircleIconSolid className="hidden size-6 text-primary-900 group-data-[state=checked]:block" />
                                    </RadioGroup.Item>
                                    <AddressItem address={address} />
                                  </label>
                                  <div className="h-px w-full bg-primary-50 last:hidden"></div>
                                </React.Fragment>
                              );
                            })}
                          </div>
                        </RadioGroup.Root>
                      );
                    }}
                  ></Controller>
                )}
              </ScrollArea>
            </div>

            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={!isDirty || isSubmitting}
                className="min-w-24 gap-1.5"
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
                    {'Save Changes'}
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
export default ChangeDefaultAddress;
