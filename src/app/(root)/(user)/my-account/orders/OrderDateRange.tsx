'use client';

import { DatePickerWithRange } from '@/components/UI/DatePicker';
import { useOrderFilters } from '@/lib/hooks/useOrderFilters';
import { XIcon } from 'lucide-react';
import { Suspense } from 'react';
import { DateRange } from 'react-day-picker';

const OrderDateRange = () => {
  return (
    <Suspense
      fallback={
        <div className="min-h-9 min-w-48 animate-pulse rounded-md bg-primary-50" />
      }
    >
      <OrderDateRangeClient />
    </Suspense>
  );
};

const OrderDateRangeClient = () => {
  const { queryStates, setQueryStates } = useOrderFilters();

  const dateFrom = queryStates.orderDateRange?.at(0);
  const dateTo = queryStates.orderDateRange?.at(1);
  let dateRange: DateRange | undefined = undefined;

  if (dateFrom) dateRange = { from: dateFrom, to: dateTo };

  return (
    <div className="relative">
      <DatePickerWithRange
        dateRange={dateRange}
        setDateRange={(range) => {
          if (!range || !range.from) {
            setQueryStates({ orderDateRange: null });
            return;
          }
          setQueryStates({
            orderDateRange: [range.from, range.to ? range.to : range.from],
          });
        }}
        placeholder="Select Order Date Range"
      />
      {dateRange && (
        <button
          onClick={() => setQueryStates({ orderDateRange: null })}
          className="absolute -top-0.5 right-1.5 inline-flex -translate-y-full text-primary-400"
        >
          <XIcon size={20} />
        </button>
      )}
    </div>
  );
};
export default OrderDateRange;
