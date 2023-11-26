import { usePaginationQueryState } from '@/lib/hooks/shop-filter-hooks';
import { TotalProducts } from '@/lib/types/ShopFilter';
import { FILTER_PRODUCTS_PER_PAGE } from '@/lib/validation/constants';

const FilterProductsStatusText = ({
  totalProducts,
}: {
  totalProducts: TotalProducts;
}) => {
  const { value: currentPage } = usePaginationQueryState();

  if (!totalProducts || totalProducts < 1) return null;

  const range = [
    (currentPage - 1) * FILTER_PRODUCTS_PER_PAGE + 1,
    Math.min(currentPage * FILTER_PRODUCTS_PER_PAGE, totalProducts),
  ];

  console.log('SHOP STATUS RENDERED');

  return (
    <p className="flex-grow pb-2 text-black/60">
      Showing {range.at(0)}-{range.at(1)} of {totalProducts} Products
    </p>
  );
};

export default FilterProductsStatusText;
