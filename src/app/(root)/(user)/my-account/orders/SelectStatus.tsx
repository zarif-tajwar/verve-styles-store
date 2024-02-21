'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/UI/Select';
import { useOrderFilterStore } from '@/lib/store/user-order';
import { SelectGroup } from '@radix-ui/react-select';
import { XIcon } from 'lucide-react';

const selectValues = ['delivered', 'ongoing', 'cancelled', 'returned'];

const SelectStatus = () => {
  const status = useOrderFilterStore((store) => store.status);
  const setStatus = useOrderFilterStore((store) => store.setStatus);
  return (
    <div className="relative">
      <Select value={status} onValueChange={(v) => setStatus(v)}>
        <SelectTrigger className="min-w-48 capitalize">
          <SelectValue placeholder="Choose Order Status" />
        </SelectTrigger>
        <SelectContent side="bottom" align="center" sideOffset={8}>
          <SelectGroup>
            <SelectLabel>Order Status</SelectLabel>
            {selectValues.map((option) => {
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
          onClick={() => setStatus('')}
          className="absolute -top-0.5 right-2 inline-flex -translate-y-full text-primary-400"
        >
          <XIcon size={20} />
        </button>
      )}
    </div>
  );
};
export default SelectStatus;
