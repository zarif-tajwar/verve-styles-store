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
import { useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

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
        className="p-6 sm:max-w-2xl sm:p-8"
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <div className="relative mb-8 sm:mb-10 md:mb-12">
              <h2 className="mb-1 text-lg font-semibold sm:text-xl">
                Change Default Address
              </h2>
              <p className="text-sm text-primary-400 sm:text-base">{`Select your default address here. Click Save Changes when you're finished.`}</p>
            </div>
            <ScrollArea
              type="always"
              className="h-[200px] pr-4"
              scrollBarClassName="w-2"
            >
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
                                  'items-center gap-4 rounded-lg px-3 py-2 ring-1 ring-inset ring-primary-50',
                                  'has-[:checked]:ring-2 has-[:checked]:ring-primary-400',
                                  'grid grid-cols-[1.25rem_1fr]',
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
                                  <p className="font-medium">{address.label}</p>
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
            </ScrollArea>
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
