import { TotalProducts } from '@/lib/types/ShopFilter';
import MobilePagination from './MobilePagination';
import ShopFiltersDrawer from './ShopFiltersDrawer';

const ShopFilterStickyMenuMobile = ({
  totalProducts,
}: {
  totalProducts: TotalProducts;
}) => {
  return (
    <div className="sticky inset-x-0 bottom-2 z-20 flex justify-center pt-4 lg:hidden">
      <div className="grid w-max grid-cols-[auto_auto_1fr] gap-2 rounded-xl border border-primary-100 bg-primary-0 p-2">
        <ShopFiltersDrawer />
        <div className="h-full w-px bg-primary-50"></div>
        <MobilePagination totalProducts={totalProducts} />
      </div>
    </div>
  );
};
export default ShopFilterStickyMenuMobile;
