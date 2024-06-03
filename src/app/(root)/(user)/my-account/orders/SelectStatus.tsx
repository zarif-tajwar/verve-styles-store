'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/UI/Select';
import { OrdersFilterSelectValues } from '@/lib/constants/orders';
import { useOrderFilters } from '@/lib/hooks/useOrderFilters';
import { SelectGroup } from '@radix-ui/react-select';
import { XIcon } from 'lucide-react';
import { Suspense } from 'react';

const SelectStatus = () => {
  return (
    <Suspense
      fallback={
        <div className="min-h-9 min-w-48 animate-pulse rounded-md bg-primary-50" />
      }
    >
      <SelectStatusClient />
    </Suspense>
  );
};

const SelectStatusClient = () => {
  const { queryStates, setQueryStates } = useOrderFilters();
  const status = queryStates.status;
  return (
    <div className="relative">
      <Select
        value={(status as string) || ''}
        onValueChange={(v) => setQueryStates({ status: v as typeof status })}
      >
        <SelectTrigger className="min-w-48 capitalize">
          <SelectValue placeholder="Choose Order Status" />
        </SelectTrigger>
        <SelectContent side="bottom" align="center" sideOffset={8}>
          <SelectGroup>
            <SelectLabel>Order Status</SelectLabel>
            {OrdersFilterSelectValues.map((option) => {
              return (
                <SelectItem value={option} key={option} className="capitalize">
                  {option}
                </SelectItem>
              );
            })}
          </SelectGroup>
        </SelectContent>
      </Select>
      {status && (
        <button
          onClick={() => setQueryStates({ status: null })}
          className="absolute -top-0.5 right-2 inline-flex -translate-y-full text-primary-400"
        >
          <XIcon size={20} />
        </button>
      )}
    </div>
  );
};
export default SelectStatus;
