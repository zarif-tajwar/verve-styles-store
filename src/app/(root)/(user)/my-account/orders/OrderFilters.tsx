import { SearchIconSm } from '@/components/Svgs/icons';
import { Button } from '@/components/UI/Button';
import { ChevronDown } from 'lucide-react';
import SelectStatus from './SelectStatus';

const OrderFilters = () => {
  return (
    <div className="mb-8 grid grid-cols-[1fr_auto] gap-x-8">
      <search className="relative">
        <input
          type="text"
          name="search-order"
          id="search-order"
          className="w-full rounded-full bg-primary-50 py-2 pl-10 pr-4 text-sm"
          placeholder="Search for Order ID or Product Name"
        />
        <SearchIconSm className="absolute left-3 top-1/2 -translate-y-1/2 text-primary-300" />
      </search>
      <div className="flex gap-4">
        <SelectStatus />
        <Button variant={'outline'} size={'sm'} roundness={'lg'}>
          Order Date Range
        </Button>
      </div>
    </div>
  );
};
export default OrderFilters;
