import FilterMenu from './FilterMenu';
import OrderFilterSearch from './OrderFilterSearch';

const OrderFilters = () => {
  return (
    <div className="mb-8 grid items-end gap-x-8 gap-y-8 sm:mb-10 md:grid-cols-[1fr_auto] xl:mb-16 xl:gap-x-10 2xl:gap-x-16">
      <OrderFilterSearch />
      <FilterMenu />
    </div>
  );
};
export default OrderFilters;
