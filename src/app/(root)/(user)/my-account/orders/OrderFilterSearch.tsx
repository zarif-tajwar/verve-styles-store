'use client';

import { SearchIconSm } from '@/components/Svgs/icons';
import { messageToast } from '@/components/UI/Toaster';

const OrderFilterSearch = () => {
  return (
    <search
      className="relative"
      onFocus={() =>
        messageToast('Not implemented yet!', {
          position: 'top-center',
        })
      }
    >
      <input
        type="text"
        name="search-order"
        id="search-order"
        className="w-full min-w-0 rounded-full bg-primary-50 py-2.5 pl-10 pr-4 text-sm"
        placeholder="Search for Order ID or Product Name"
      />
      <SearchIconSm className="absolute left-3 top-1/2 -translate-y-1/2 text-primary-300" />
    </search>
  );
};
export default OrderFilterSearch;
