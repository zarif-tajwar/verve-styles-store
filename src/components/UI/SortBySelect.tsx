'use client';

import React from 'react';
import * as Select from '@radix-ui/react-select';
import { ChevronDownIcon } from '@radix-ui/react-icons';
import { cn } from '@/lib/util';
import { Icons } from '../Svgs/icons';

import { useSelectSearchQuery } from '@/lib/hooks/useSelectSearchQuery';
import { Variants, motion, AnimatePresence } from 'framer-motion';

const sortOptions = [
  { value: 'most-recent', title: 'Most Recent' },
  { value: 'most-popular', title: 'Most Popular' },
  { value: 'price-low-to-high', title: 'Price (Low to High)' },
  { value: 'price-high-to-low', title: 'Price (High to Low)' },
];

const defaultOptionValue = sortOptions[0].value;

const SortBySelect = () => {
  return (
    <div className="flex flex-col items-end gap-1">
      <span className="mr-1 inline-block pr-3 text-sm text-black/60">
        Sort By
      </span>
      <SelectMain />
    </div>
  );
};
export default SortBySelect;

const SelectMain = () => {
  const { getOptionValue, handleValueChange } = useSelectSearchQuery({
    defaultOptionValue,
    options: sortOptions.map((o) => o.value),
    searchQueryKey: 'sort_by',
  });

  return (
    <Select.Root
      value={getOptionValue() || defaultOptionValue}
      onValueChange={handleValueChange}
    >
      <Select.Trigger
        className={cn(
          'flex h-9 items-center gap-1 rounded-lg border-none px-3 py-4 outline-none',
          'hover:bg-offwhite',
          'transition-all duration-200',
          'focus-visible:ring-2 focus-visible:ring-black',
          'group',
        )}
      >
        <Select.Value />
        <Select.Icon className="h-4 w-4 transition-all duration-100 group-data-[state=open]:-rotate-180">
          <ChevronDownIcon className="h-full w-full" />
        </Select.Icon>
      </Select.Trigger>

      <Select.Portal>
        <Select.Content
          onCloseAutoFocus={(e) => e.preventDefault()}
          position="popper"
          sideOffset={4}
          side="bottom"
          align="end"
          className="rounded-lg bg-white px-1.5 py-1.5 text-neutral-700 shadow-xl ring-1 ring-offwhite"
          asChild
        >
          <Select.Viewport>
            <Select.Group className="space-y-1.5">
              {sortOptions.map((option) => (
                <Select.Item
                  className={cn(
                    'flex cursor-pointer select-none items-center justify-between gap-2 rounded-md px-2 py-2 text-sm outline-none',
                    'data-[highlighted]:bg-offwhite',
                    'transition-all duration-200',
                  )}
                  key={option.value}
                  value={option.value}
                >
                  <Select.ItemText>{option.title}</Select.ItemText>
                  <Select.ItemIndicator>
                    <Icons.checkMini className="h-4 w-4" />
                  </Select.ItemIndicator>
                </Select.Item>
              ))}
            </Select.Group>
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
};
