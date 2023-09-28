'use client';

import React from 'react';
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
    <div className="mb-4 flex items-center justify-end">
      <span>Sort by:</span> <SelectMain />
    </div>
  );
};
export default SortBySelect;

const SelectMain = () => {
  return (
    <Select.Root defaultValue="1">
      <Select.Trigger
        className={cn(
          'flex items-center gap-1 rounded-lg border-none px-3 py-1.5 text-sm outline-none',
          'hover:bg-offwhite',
          'transition-all duration-200',
          'focus-visible:ring-2 focus-visible:ring-black',
        )}
      >
        <Select.Value />
        <Select.Icon className="h-4 w-4">
          <ChevronDownIcon className="h-full w-full" />
        </Select.Icon>
      </Select.Trigger>

      <Select.Portal>
        <Select.Content className="rounded-lg bg-white px-1.5 py-2 text-sm">
          <Select.ScrollUpButton>*</Select.ScrollUpButton>
          <Select.Viewport>
            <Select.Group>
              {sortOptions.map((option) => (
                <Select.Item
                  className={cn(
                    'cursor-pointer rounded-md border-2 border-transparent px-1.5 py-1.5 outline-none',
                    'hover:bg-offwhite',
                    'focus-visible:border-black',
                  )}
                  key={option.id}
                  value={option.id.toString()}
                >
                  <Select.ItemText>{option.name}</Select.ItemText>
                </Select.Item>
              ))}
            </Select.Group>
          </Select.Viewport>
          <Select.ScrollDownButton>*</Select.ScrollDownButton>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
};
