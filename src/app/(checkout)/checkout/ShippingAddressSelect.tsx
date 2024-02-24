'use client';

import { Select, SelectTrigger } from '@/components/UI/Select';
import { AddressSelect } from '@/lib/db/schema/address';
import { useCheckoutStore } from '@/lib/store/checkout-store';
import { cn } from '@/lib/util';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { CheckCircleIcon, CheckIcon } from '@heroicons/react/24/solid';
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@radix-ui/react-accordion';
import {
  SelectContent,
  SelectIcon,
  SelectItem,
  SelectItemIndicator,
  SelectItemText,
  SelectPortal,
  SelectSeparator,
  SelectValue,
  SelectViewport,
} from '@radix-ui/react-select';
import React, { useEffect, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';
import * as ScrollArea from '@radix-ui/react-scroll-area';
import { ScrollBar } from '@/components/UI/ScrollArea';

const ShippingAddressSelect = ({
  savedAddresses,
}: {
  savedAddresses: AddressSelect[];
}) => {
  const mode = useCheckoutStore(
    useShallow((store) => store.shippingAddress.mode),
  );
  const setMode = useCheckoutStore((store) => store.setShippingAdressMode);
  const setAddressId = useCheckoutStore((store) => store.setAddressId);
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

  useEffect(() => {
    setAddressId(Number.parseInt(selectValue));
  }, [selectValue, setAddressId]);

  return (
    <div className="p-1">
      <Select
        value={selectValue}
        onValueChange={setValue}
        onOpenChange={(open) => {
          if (open && !isActive) {
            setMode('select');
          }
        }}
      >
        <SelectTrigger
          className="group grid grid-cols-[1fr_auto] bg-primary-50 text-left shadow-none ring-0"
          noLineClamp
          removeDefaultIcon
        >
          <SelectValue placeholder="Select" className="">
            {selectedAddress && <AddressItem address={selectedAddress} />}
          </SelectValue>
          <SelectIcon className="inline-flex size-6 items-center justify-center rounded-full text-primary-500 transition-colors duration-100 group-hover:bg-primary-400 group-hover:text-primary-0">
            <ChevronDownIcon className="size-5" />
          </SelectIcon>
        </SelectTrigger>
        <SelectPortal>
          <SelectContent
            onCloseAutoFocus={(e) => e.preventDefault()}
            className=""
          >
            <ScrollArea.Root className="w-full">
              <SelectViewport
                asChild
                className="h-full max-h-[60dvh] w-full max-w-[calc(100vw-2rem)] rounded-lg bg-primary-0 p-3 shadow-drop"
              >
                <ScrollArea.Viewport>
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
                        <SelectSeparator className="mx-auto my-3 h-px w-[96%] bg-primary-50 last:hidden" />
                      </React.Fragment>
                    );
                  })}
                </ScrollArea.Viewport>
              </SelectViewport>
              <ScrollBar className="w-2" />
            </ScrollArea.Root>
          </SelectContent>
        </SelectPortal>
      </Select>
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
      <dl className="grid w-full gap-x-8 gap-y-2 font-medium text-primary-500 [@media(width>460px)]:grid-cols-2">
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
        <span className="absolute right-0 top-0.5 rounded-full bg-primary-100 px-2 text-xs text-primary-500 ring-1 ring-black/10">
          Default
        </span>
      )}
    </div>
  );
};
