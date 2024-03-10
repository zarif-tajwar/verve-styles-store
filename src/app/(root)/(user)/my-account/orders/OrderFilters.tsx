import { SearchIconSm } from '@/components/Svgs/icons';

import FilterMenu from './FilterMenu';
import OrderFilterSearch from './OrderFilterSearch';
import { SetValues, Values } from 'nuqs';
import { GetOrdersUseQueryStateSchema } from '@/lib/types/orders';

const OrderFilters = ({
  queryStates,
  setQueryStates,
}: {
  queryStates: Values<GetOrdersUseQueryStateSchema>;
  setQueryStates: SetValues<GetOrdersUseQueryStateSchema>;
}) => {
  return (
    <div className="mb-8 grid items-end gap-x-8 gap-y-8 sm:mb-10 md:grid-cols-[1fr_auto] xl:mb-16 xl:gap-x-10 2xl:gap-x-16">
      <OrderFilterSearch />
      <FilterMenu queryStates={queryStates} setQueryStates={setQueryStates} />
    </div>
  );
};
export default OrderFilters;
