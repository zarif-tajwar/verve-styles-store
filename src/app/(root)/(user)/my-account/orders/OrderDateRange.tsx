'use client';

import { DatePickerWithRange } from '@/components/UI/DatePicker';
import { useOrderFilterStore } from '@/lib/store/user-order';
import { XIcon } from 'lucide-react';

const OrderDateRange = () => {
  const dateRange = useOrderFilterStore((store) => store.orderDateRange);
  const setDateRange = useOrderFilterStore((store) => store.setOrderDateRange);

  return (
    <div className="relative">
      <DatePickerWithRange
        dateRange={dateRange}
        setDateRange={setDateRange}
        placeholder="Select Order Date Range"
      />
      {dateRange && (
        <button
          onClick={() => setDateRange(undefined)}
          className="absolute -top-0.5 right-1.5 inline-flex -translate-y-full text-primary-400"
        >
          <XIcon size={20} />
        </button>
      )}
    </div>
  );
};
export default OrderDateRange;
