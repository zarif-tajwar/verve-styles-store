'use client';

import { DatePickerWithRange } from '@/components/UI/DatePicker';
import { XIcon } from 'lucide-react';
import { useState } from 'react';
import { DateRange } from 'react-day-picker';

const OrderDateRange = () => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
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
