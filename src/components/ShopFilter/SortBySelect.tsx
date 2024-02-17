'use client';

import React from 'react';
// import * as Select from '@radix-ui/react-select';
import { cn } from '@/lib/util';
import { CheckMini } from '../Svgs/icons';
import {
  defaultSortOptionValue,
  sortOptions,
} from '@/lib/validation/constants';

import { Button } from '../UI/Button';
import { ChevronDown } from 'lucide-react';
import { useShopFilter } from '@/lib/hooks/useShopFilter';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '../UI/Select';

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
  const singleOptionCheck = useShopFilter((store) => store.singleOptionCheck);

  const { currentOptionValue, handleValueChange } =
    singleOptionCheck('sort_by');

  return (
    <Select
      value={currentOptionValue || defaultSortOptionValue}
      onValueChange={handleValueChange}
    >
      <SelectTrigger className="w-max min-w-48 capitalize">
        <SelectValue placeholder="Choose Order Status" />
      </SelectTrigger>
      <SelectContent side="bottom" align="end">
        <SelectGroup>
          {sortOptions.map((option) => {
            return (
              <SelectItem
                value={option.value}
                key={option.value}
                className="capitalize"
              >
                {option.title}
              </SelectItem>
            );
          })}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
