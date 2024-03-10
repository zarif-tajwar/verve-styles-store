'use client';

import { Button } from '@/components/UI/Button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/UI/Dialog';
import { ScrollArea } from '@/components/UI/ScrollArea';
import AddressSelectItem from '@/components/account/address/AddressSelectItem';
import { useCheckoutStore } from '@/lib/store/checkout-store';
import { UserAddress } from '@/lib/types/user';
import { CheckCircleIcon } from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleIconSolid } from '@heroicons/react/24/solid';
import { DialogClose } from '@radix-ui/react-dialog';
import * as RadioGroup from '@radix-ui/react-radio-group';
import React, { useEffect } from 'react';

const ShippingAddressSelect = ({
  savedAddresses,
}: {
  savedAddresses: UserAddress[];
}) => {
  const addressId = useCheckoutStore(
    (store) => store.shippingAddress.select.addressId,
  );

  const defaultAddress = savedAddresses.find((address) => address.isDefault);

  const selectedAddress =
    savedAddresses.find((address) => address.id === addressId) ??
    defaultAddress ??
    savedAddresses.at(0);

  return (
    <div className="p-1">
      <h3 className="mb-5 text-base font-semibold text-primary-400 sm:text-lg">
        {savedAddresses.length > 1
          ? `Currently Selected Address`
          : `Your Saved Address`}
      </h3>
      <AddressSelectItem address={selectedAddress!} />
      {savedAddresses.length > 1 && (
        <AddressSelectModal savedAddresses={savedAddresses} />
      )}
    </div>
  );
};
export default ShippingAddressSelect;

const AddressSelectModal = ({
  savedAddresses,
}: {
  savedAddresses: UserAddress[];
}) => {
  const addressId = useCheckoutStore(
    (store) => store.shippingAddress.select.addressId,
  );
  const setAddressId = useCheckoutStore((store) => store.setAddressId);

  const defaultAddressId = savedAddresses.find(
    (address) => address.isDefault,
  )?.id;

  useEffect(() => {
    if (addressId || !defaultAddressId) return;
    setAddressId(defaultAddressId);
  }, [defaultAddressId, addressId, setAddressId]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          roundness={'lg'}
          variant={'secondary'}
          className="mt-6 px-8 font-semibold"
        >
          Choose Other Address
        </Button>
      </DialogTrigger>
      <DialogContent className="p-6 sm:max-w-xl sm:p-8">
        <div className="relative mb-4 sm:mb-6 md:mb-8">
          <h2 className="mb-1 text-lg font-semibold sm:text-xl">
            Your Saved Addresses
          </h2>
          <p className="text-balance text-sm text-primary-400 sm:text-base">{`Click and select your saved address here. Press done when you're finished.`}</p>
        </div>
        <div className="mb-4 w-full rounded-xl border border-primary-100 sm:mb-6">
          <ScrollArea scrollBarClassName="w-2" className="h-[300px] w-full">
            <RadioGroup.Root
              value={addressId?.toString()}
              onValueChange={(value) => {
                setAddressId(value);
              }}
            >
              <div className="grid px-4">
                {savedAddresses.map((address) => {
                  return (
                    <React.Fragment key={address.id}>
                      <label
                        htmlFor={address.id.toString()}
                        className="grid cursor-pointer grid-cols-[1.5rem_auto] gap-x-2.5 py-4"
                      >
                        <RadioGroup.Item
                          value={address.id.toString()}
                          className="group flex -translate-y-0.5 flex-col justify-start"
                          id={address.id.toString()}
                        >
                          <CheckCircleIcon className="size-6 text-primary-100 group-data-[state=checked]:hidden" />
                          <CheckCircleIconSolid className="hidden size-6 text-primary-900 group-data-[state=checked]:block" />
                        </RadioGroup.Item>
                        <AddressSelectItem address={address} />
                      </label>
                      <div className="h-px w-full bg-primary-50 last:hidden"></div>
                    </React.Fragment>
                  );
                })}
              </div>
            </RadioGroup.Root>
          </ScrollArea>
        </div>
        <div className="flex justify-end">
          <DialogClose asChild>
            <Button roundness={'lg'} className="px-5">
              Done
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
};
