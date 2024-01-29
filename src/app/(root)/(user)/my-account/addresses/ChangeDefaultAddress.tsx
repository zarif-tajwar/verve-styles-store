'use client';

import { Button } from '@/components/UI/Button';
import { LinkIcon, SpeakerWaveIcon } from '@heroicons/react/16/solid';
import {
  Dialog,
  DialogCloseBtn,
  DialogContent,
  DialogTrigger,
} from '@/components/UI/Dialog';
import * as RadioGroup from '@radix-ui/react-radio-group';
import { useAddressesQuery } from '@/lib/hooks/useAddressQuery';
import { useSession } from 'next-auth/react';
import * as ScrollArea from '@radix-ui/react-scroll-area';
import { DialogClose } from '@radix-ui/react-dialog';
import { FormEvent, useEffect, useMemo, useState } from 'react';
import { cn, wait } from '@/lib/util';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { changeDefaultAddressAction } from '@/lib/actions/address';
import { useAction } from 'next-safe-action/hooks';
import { errorToast, successToast } from '@/components/UI/Toaster';
import Spinner from '@/components/UI/Spinner';
import { SaveIcon } from '@/components/Svgs/icons';
import { Controller, useForm } from 'react-hook-form';
import {
  DefaultAddressFormSchema,
  DefaultAddressFormSchemaType,
} from '@/lib/validation/address-form';
import { zodResolver } from '@hookform/resolvers/zod';

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
        className="p-8 sm:max-w-2xl"
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <div className="relative mb-8">
              <h2 className="mb-1 text-xl font-semibold">
                Change Default Address
              </h2>
              <p className="text-primary-400">{`Select your default address here. Click Save Changes when you're finished.`}</p>
            </div>
            <ScrollArea.Root className="h-full min-w-[24rem] rounded-xl transition-opacity">
              <ScrollArea.Viewport className="h-full max-h-[15rem] w-full rounded-lg p-4 shadow-inner">
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
                          <div className="grid gap-4">
                            {addresses.map((address) => {
                              return (
                                <label
                                  key={address.id}
                                  htmlFor={`address-${address.id}`}
                                  className={cn(
                                    'flex items-center gap-4 rounded-lg px-3 py-2 ring-1 ring-inset ring-primary-50',
                                    'has-[:checked]:ring-2 has-[:checked]:ring-primary-400',
                                  )}
                                >
                                  <RadioGroup.Item
                                    id={`address-${address.id}`}
                                    value={address.id.toString()}
                                    className="relative size-5 rounded-full ring-2 ring-inset ring-primary-50 data-[state=checked]:ring-primary-400"
                                  >
                                    <RadioGroup.Indicator className="absolute left-1/2 top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary-400" />
                                  </RadioGroup.Item>
                                  <div className="text-sm">
                                    <p className="font-medium">
                                      {address.label}
                                    </p>
                                    <p>{`${address.address}, ${address.city}, ${address.country}, ${address.phone}`}</p>
                                  </div>
                                </label>
                              );
                            })}
                          </div>
                        </RadioGroup.Root>
                      );
                    }}
                  ></Controller>
                )}
              </ScrollArea.Viewport>
              <ScrollArea.Scrollbar
                className="flex w-2.5 touch-none select-none rounded-lg bg-primary-50 p-0.5 transition-colors duration-[160ms] ease-out hover:bg-primary-100"
                orientation="vertical"
              >
                <ScrollArea.Thumb className="relative flex-1 rounded-[10px] bg-primary-200 before:absolute before:left-1/2 before:top-1/2 before:h-full before:min-h-[44px] before:w-full before:min-w-[44px] before:-translate-x-1/2 before:-translate-y-1/2 before:content-['']" />
              </ScrollArea.Scrollbar>
            </ScrollArea.Root>

            <div className="flex justify-end pt-8">
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
