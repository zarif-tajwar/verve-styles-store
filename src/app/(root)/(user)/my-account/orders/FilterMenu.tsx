import SelectStatus from './SelectStatus';
import OrderDateRange from './OrderDateRange';
import { SetValues, Values } from 'nuqs';
import { GetOrdersUseQueryStateSchema } from '@/lib/types/orders';

export const FilterMenuContent = ({
  queryStates,
  setQueryStates,
}: {
  queryStates: Values<GetOrdersUseQueryStateSchema>;
  setQueryStates: SetValues<GetOrdersUseQueryStateSchema>;
}) => {
  return (
    <div className="flex flex-col gap-2 gap-y-4 sm:flex-row">
      <SelectStatus queryStates={queryStates} setQueryStates={setQueryStates} />
      <OrderDateRange
        queryStates={queryStates}
        setQueryStates={setQueryStates}
      />
    </div>
  );
};

export default FilterMenuContent;
