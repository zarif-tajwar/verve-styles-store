'use client';

import React from 'react';
import * as Select from '@radix-ui/react-select';
import { cn } from '@/lib/util';
import { Icons } from '../Svgs/icons';
import {
  defaultSortOptionValue,
  sortOptions,
} from '@/lib/validation/constants';

import { useSelectSearchQuery } from '@/lib/hooks/useSelectSearchQuery';
import { Button } from './Button';
import { ChevronDown } from 'lucide-react';

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
      <Select.Trigger asChild>
        <Button
          variant={'ghost'}
          size={'md'}
          roundness={'lg'}
          className="group origin-top-right select-none font-medium text-primary-900 duration-200 data-[state=open]:scale-90 data-[state=open]:bg-primary-50 data-[state=open]:text-primary-300"
        >
          <Select.Value />
          <Select.Icon className="h-4 w-4 transition-all duration-100 ease-linear group-data-[state=open]:-rotate-180">
            <ChevronDown size={18} />
          </Select.Icon>
        </Button>
      </Select.Trigger>

      <Select.Portal>
        <Select.Content
          onCloseAutoFocus={(e) => e.preventDefault()}
          position="popper"
          sideOffset={4}
          side="bottom"
          align="end"
          className={cn(
            'rounded-lg bg-white p-2 ring-1 ring-primary-50',
            'select-none shadow-drop',
            'origin-top-right data-[state=open]:animate-scaleFromTopRightAnim',
          )}
          asChild
        >
          <Select.Viewport>
            <Select.Group>
              {sortOptions.map((option) => (
                <Select.Item
                  className={cn(
                    'relative flex cursor-pointer select-none items-center justify-start gap-2 rounded-md py-2.5 pl-8 pr-4 text-sm text-primary-500 outline-none',
                    'data-[highlighted]:bg-primary-50',
                    'transition-all duration-200',
                  )}
                  key={option.value}
                  value={option.value}
                >
                  <Select.ItemIndicator className="absolute left-2 top-1/2 -translate-y-1/2">
                    <Icons.checkMini className="h-4 w-4" />
                  </Select.ItemIndicator>
                  <Select.ItemText>{option.title}</Select.ItemText>
                </Select.Item>
              ))}
            </Select.Group>
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
};
