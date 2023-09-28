'use client';

import React, { useState } from 'react';
import * as Select from '@radix-ui/react-select';
import { ChevronDownIcon } from '@radix-ui/react-icons';
import { cn } from '@/lib/util';
import { Icons } from '../Svgs/icons';

const sortOptions = [
  { id: 1, name: 'Most Recent' },
  { id: 2, name: 'Most Popular' },
  { id: 3, name: 'Price (Low to High)' },
  { id: 4, name: 'Price (High to Low)' },
];

const SortBySelect = () => {
  return (
    <div className="flex items-center justify-end">
      <span className="mr-1 inline-block text-black/60">Sort by :</span>{' '}
      <SelectMain />
    </div>
  );
};
export default SortBySelect;

const SelectMain = () => {
  const [selectedOption, setSelectedOption] = useState('1');

  return (
    <Select.Root
      value={selectedOption}
      onValueChange={(value) => setSelectedOption(value)}
    >
      <Select.Trigger
        className={cn(
          'flex h-9 items-center gap-1 rounded-lg border-none px-3 py-2 outline-none',
          'hover:bg-offwhite',
          'transition-all duration-200',
          'focus-visible:ring-2 focus-visible:ring-black',
        )}
      >
        <Select.Value defaultValue={selectedOption} />
        <Select.Icon className="h-4 w-4">
          <ChevronDownIcon className="h-full w-full" />
        </Select.Icon>
      </Select.Trigger>

      {/* <Select.Portal> */}
      <Select.Content
        onCloseAutoFocus={(e) => e.preventDefault()}
        position="popper"
        sideOffset={4}
        hideWhenDetached
        side="bottom"
        align="end"
        className="rounded-lg bg-white px-1.5 py-1.5 text-neutral-700 shadow-md ring-1 ring-offwhite"
      >
        <Select.Viewport>
          <Select.Group>
            {sortOptions.map((option) => (
              <Select.Item
                className={cn(
                  'cursor-pointer rounded-md px-1.5 py-1.5 text-sm outline-none',
                  'data-[highlighted]:bg-offwhite',
                  'data-[state=checked]:bg-neutral-200',
                )}
                key={option.id}
                value={option.id.toString()}
              >
                <Select.ItemText>{option.name}</Select.ItemText>
              </Select.Item>
            ))}
          </Select.Group>
        </Select.Viewport>
      </Select.Content>
      {/* </Select.Portal> */}
    </Select.Root>
  );
};
