import SelectStatus from './SelectStatus';
import OrderDateRange from './OrderDateRange';

export const FilterMenuContent = () => {
  return (
    <div className="flex gap-2">
      <SelectStatus />
      <OrderDateRange />
    </div>
  );
};

export default FilterMenuContent;
