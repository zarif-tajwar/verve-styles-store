'use client';

import { Button } from '@/components/UI/Button';
import { LinkIcon } from '@heroicons/react/16/solid';
import {
  Dialog,
  DialogCloseBtn,
  DialogContent,
  DialogTrigger,
} from '@/components/UI/Dialog';
import * as RadioGroup from '@radix-ui/react-radio-group';
import { useAddressesQuery } from '@/lib/hooks/address-hooks';
import { useSession } from 'next-auth/react';
import * as ScrollArea from '@radix-ui/react-scroll-area';
import { DialogClose } from '@radix-ui/react-dialog';
import { useState } from 'react';
import { cn } from '@/lib/util';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { changeDefaultAddressAction } from '@/lib/actions/user';

const ChangeDefaultAddress = () => {
  const session = useSession();
  const addressesQuery = useAddressesQuery(session.data ?? undefined);
  const queryClient = useQueryClient();

  const { mutateAsync: changeDefaultAddressMutateAsync } = useMutation({
    mutationFn: changeDefaultAddressAction,
    onSuccess: async () => {
      await queryClient.refetchQueries({ queryKey: ['addresses'] });
    },
  });

  const defaultAddress = addressesQuery.data?.find(
    (address) => address.isDefault,
  );

  const [value, setValue] = useState<string | undefined>(
    defaultAddress?.id.toString(),
  );

  return (
    <Dialog>
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
        <div>
          <div className="relative mb-8">
            <h2 className="mb-1 text-xl font-semibold">
              Change Default Address
            </h2>
            <p className="text-primary-400">{`Select your default address here. Click Done when you're finished.`}</p>
          </div>
          <ScrollArea.Root className="h-full min-w-[24rem] rounded-xl transition-opacity">
            <ScrollArea.Viewport className="h-full max-h-[15rem] w-full rounded-lg p-4 shadow-inner">
              {addressesQuery.data && (
                <RadioGroup.Root
                  value={value}
                  onValueChange={async (value) => {
                    if (!session.data) return;
                    setValue(value);
                    await changeDefaultAddressMutateAsync({
                      addressId: Number.parseInt(value),
                      session: session.data,
                    });
                  }}
                >
                  <div className="grid gap-4">
                    {addressesQuery.data.map((address) => {
                      return (
                        <label
                          key={address.id}
                          htmlFor={`address-${address.id}`}
                          className={cn(
                            'flex items-center gap-4 rounded-lg px-3 py-2 ring-1 ring-inset ring-primary-50',
                            value === address.id.toString() &&
                              'ring-2 ring-primary-400',
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
            <DialogClose asChild>
              <Button className="min-w-20">Done</Button>
            </DialogClose>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
export default ChangeDefaultAddress;
