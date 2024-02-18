'use client';

import { TotalProducts } from '@/lib/types/ShopFilter';
import ShopFilterPagination from './ShopFilterPagination';
import ShopFiltersDrawer from './ShopFiltersDrawer';

const ShopFilterBottomMenu = ({
  totalProducts,
}: {
  totalProducts: TotalProducts;
}) => {
  return (
    <div className="sticky inset-x-0 bottom-2 z-20 flex justify-center pt-8 lg:pt-16">
      <div className="grid w-max grid-cols-[auto_auto_1fr] gap-2 rounded-xl border border-primary-100 bg-primary-0 p-2 lg:flex lg:border-none lg:p-0">
        <ShopFiltersDrawer />
        <div className="h-full w-px bg-primary-50 lg:hidden"></div>
        <ShopFilterPagination totalProducts={totalProducts} />
      </div>
    </div>
  );
};
export default ShopFilterBottomMenu;
