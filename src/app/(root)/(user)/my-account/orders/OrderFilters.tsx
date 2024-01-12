import { CalendarMini, SearchIconSm } from '@/components/Svgs/icons';
import { Button } from '@/components/UI/Button';
import { ChevronDown } from 'lucide-react';
import SelectStatus from './SelectStatus';

const OrderFilters = () => {
  return (
    <div className="mb-16 grid grid-cols-[1fr_auto] items-end gap-x-16">
      <search className="relative">
        <input
          type="text"
          name="search-order"
          id="search-order"
          className="w-full rounded-full bg-primary-50 py-2.5 pl-10 pr-4 text-sm"
          placeholder="Search for Order ID or Product Name"
        />
        <SearchIconSm className="absolute left-3 top-1/2 -translate-y-1/2 text-primary-300" />
      </search>
      <div className="flex gap-2">
        <SelectStatus />
        <Button
          variant={'outline'}
          size={'sm'}
          roundness={'lg'}
          className="min-w-48 justify-between font-medium text-primary-400"
        >
          Order Date Range
          <CalendarMini className="text-primary-400" />
        </Button>
      </div>
    </div>
  );
};
export default OrderFilters;
