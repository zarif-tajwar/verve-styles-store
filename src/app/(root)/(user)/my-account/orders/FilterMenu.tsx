import SelectStatus from './SelectStatus';
import OrderDateRange from './OrderDateRange';

export const FilterMenuContent = () => {
  return (
    <div className="flex flex-col gap-2 gap-y-4 sm:flex-row">
      <SelectStatus />
      <OrderDateRange />
    </div>
  );
};

export default FilterMenuContent;
