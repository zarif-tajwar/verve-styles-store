'use client';

import { useCheckoutStore } from '@/lib/store/checkout-store';
import { useShallow } from 'zustand/react/shallow';
import { cn } from '@/lib/util';
import { CheckCircleIcon, CheckIcon } from '@heroicons/react/24/solid';
import { Select, SelectTrigger } from '@/components/UI/Select';
import {
  SelectIcon,
  SelectPortal,
  SelectValue,
  SelectContent,
  SelectViewport,
  SelectItemIndicator,
  SelectItem,
  SelectItemText,
  SelectSeparator,
} from '@radix-ui/react-select';
import { AddressSelect } from '@/lib/db/schema/address';
import React, { useState } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/solid';
import {
  BriefcaseIcon,
  HashtagIcon,
  HomeIcon,
} from '@heroicons/react/16/solid';

const ShippingAddressSelect = ({
  savedAddresses,
}: {
  savedAddresses: AddressSelect[];
}) => {
  const mode = useCheckoutStore(
    useShallow((store) => store.shippingAddress.mode),
  );
  const setMode = useCheckoutStore((store) => store.setShippingAdressMode);
  const isActive = mode === 'select';

  const defaultAddress = savedAddresses.find((address) => address.isDefault);

  const [selectValue, setValue] = useState<string>(
    defaultAddress?.id.toString() ?? '',
  );

  const selectedAddress =
    savedAddresses.find(
      (address) => address.id === Number.parseInt(selectValue),
    ) ??
    defaultAddress ??
    savedAddresses.at(0);

  return (
    <div
      className="relative rounded-xl px-6 py-6 shadow-sm"
      onClick={() => setMode('select')}
    >
      <div className="mb-5">
        <h3 className="text-lg font-semibold">Saved Addresses</h3>
        <p className="text-sm text-primary-500">
          Choose from your saved addresses
        </p>
      </div>
      <Select value={selectValue} onValueChange={setValue}>
        <SelectTrigger
          className="grid grid-cols-[1fr_auto] bg-primary-50 text-left shadow-none ring-0"
          noLineClamp
          removeDefaultIcon
        >
          <SelectValue placeholder="Select" className="">
            {selectedAddress && <AddressItem address={selectedAddress} />}
          </SelectValue>
          <SelectIcon asChild>
            <ChevronDownIcon className="size-6 text-primary-500" />
          </SelectIcon>
        </SelectTrigger>
        <SelectPortal>
          <SelectContent className="">
            <SelectViewport className="rounded-lg bg-primary-0 p-3 shadow-drop">
              {savedAddresses.map((address) => {
                return (
                  <React.Fragment key={address.id}>
                    <SelectItem
                      value={address.id.toString()}
                      className={cn(
                        'block rounded-lg py-2 pl-3 pr-9',
                        'relative w-full cursor-default select-none rounded-md text-sm outline-none focus:bg-primary-50 data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
                      )}
                    >
                      <SelectItemText>
                        <AddressItem includeLabel address={address} />
                      </SelectItemText>
                      <SelectItemIndicator
                        className="absolute right-3 top-1/2 -translate-y-1/2"
                        asChild
                      >
                        <CheckIcon className="size-6" />
                      </SelectItemIndicator>
                    </SelectItem>
                    <SelectSeparator className="mx-auto h-px w-[96%] bg-primary-50 last:hidden" />
                  </React.Fragment>
                );
              })}
            </SelectViewport>
          </SelectContent>
        </SelectPortal>
      </Select>

      {isActive && (
        <CheckCircleIcon className="absolute left-0 top-0 size-6 -translate-x-1/2 -translate-y-1/2" />
      )}
    </div>
  );
};
export default ShippingAddressSelect;

export const AddressItem = ({
  address,
  includeLabel,
}: {
  address: AddressSelect;
  includeLabel?: boolean;
}) => {
  return (
    <div className="relative text-sm">
      {includeLabel && (
        <p className="mb-1 font-semibold text-primary-400">{address.label}</p>
      )}
      <dl className="grid w-full grid-cols-2 gap-x-8 gap-y-2 font-medium text-primary-500">
        <div className="space-y-1">
          <dd className="text-primary-400 opacity-90">Address</dd>
          <dt className="font-medium">{address.address}</dt>
        </div>
        <div className="space-y-1">
          <dd className="text-primary-400 opacity-90">City</dd>
          <dt className="font-medium">{address.city}</dt>
        </div>
        <div className="space-y-1">
          <dd className="text-primary-400 opacity-90">Country</dd>
          <dt className="font-medium">{address.country}</dt>
        </div>
        <div className="space-y-1">
          <dd className="text-primary-400 opacity-90">Phone</dd>
          <dt className="font-medium">{address.phone}</dt>
        </div>
      </dl>
      {address.isDefault && (
        <span className="absolute right-0 top-0.5 rounded-full bg-primary-400 px-2 text-xs text-primary-0">
          Default
        </span>
      )}
    </div>
  );
};
