import { useShopFilter } from '@/lib/hooks/useShopFilter';
import { FILTER_PRODUCTS_PER_PAGE } from '@/lib/validation/constants';

const FilterProductsStatusText = () => {
  const totalProducts = useShopFilter((store) => store.totalProducts);
  const currentPage = useShopFilter((store) => store.currentPage);

  if (!totalProducts || totalProducts < 1) return null;

  const range = [
    (currentPage - 1) * FILTER_PRODUCTS_PER_PAGE + 1,
    Math.min(currentPage * FILTER_PRODUCTS_PER_PAGE, totalProducts),
  ];

  return (
    <p className="flex-grow pb-2 text-black/60">
      Showing {range.at(0)}-{range.at(1)} of {totalProducts} Products
    </p>
  );
};

export default FilterProductsStatusText;
