import { CalendarMini, SearchIconSm } from '@/components/Svgs/icons';

import FilterMenu from './FilterMenu';

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
      <FilterMenu />
    </div>
  );
};
export default OrderFilters;
