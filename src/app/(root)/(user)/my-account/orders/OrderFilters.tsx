import { SearchIconSm } from '@/components/Svgs/icons';

import FilterMenu from './FilterMenu';
import OrderFilterSearch from './OrderFilterSearch';

const OrderFilters = () => {
  return (
    <div className="mb-16 grid grid-cols-[1fr_auto] items-end gap-x-16">
      <OrderFilterSearch />
      <FilterMenu />
    </div>
  );
};
export default OrderFilters;
