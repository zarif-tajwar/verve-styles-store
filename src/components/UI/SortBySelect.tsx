'use client';

import React from 'react';
import * as Select from '@radix-ui/react-select';
import { ChevronDownIcon } from '@radix-ui/react-icons';
import { cn } from '@/lib/util';
import { Icons } from '../Svgs/icons';
import {
  defaultSortOptionValue,
  sortOptions,
} from '@/lib/validation/constants';

import { useSelectSearchQuery } from '@/lib/hooks/useSelectSearchQuery';
import { buttonVariants } from './Button';

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
  const { selectValue, handleValueChange } = useSelectSearchQuery({
    defaultOptionValue: defaultSortOptionValue,
    searchQueryKey: 'sort_by',
  });

  return (
    <Select.Root value={selectValue} onValueChange={handleValueChange}>
      <Select.Trigger
        className={buttonVariants({
          variant: 'ghost',
          size: 'md',
          roundness: 'lg',
        })}
      >
        <Select.Value />
        <Select.Icon className="h-4 w-4 transition-all duration-100 group-data-[state=open]:-rotate-180">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="h-full w-full"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.5 8.25l-7.5 7.5-7.5-7.5"
            />
          </svg>
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
                    'flex cursor-pointer select-none items-center justify-between gap-2 rounded-md px-4 py-2 text-sm outline-none',
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
