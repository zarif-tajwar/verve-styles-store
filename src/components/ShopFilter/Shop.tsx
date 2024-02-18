'use client';

import { useShopQuery } from '@/lib/hooks/useShopFilter';
import { cn } from '@/lib/util';
import FilterProductsStatusText from './FilterProductsStatusText';
import FilterSelectedTags from './FilterSelectedTags';
import { ProductListing } from './ProductListing';
import ShopFilterPagination from './ShopFilterPagination';
import ShopFilterStickyMenuMobile from './ShopFilterStickyMenuMobile';
import { ProductListingSkeleton } from './Skeleton';

const Shop = () => {
  const { data: productItems, isFetching } = useShopQuery();

  const totalProducts = productItems?.at(0)?.totalCount;

  return (
    <>
      <div className="col-span-2 col-start-1 row-start-1 lg:col-span-1">
        <FilterSelectedTags />
        <FilterProductsStatusText totalProducts={totalProducts} />
      </div>
      <div className="relative col-span-2 h-max">
        {!isFetching && productItems && (
          <ProductListing products={productItems} />
        )}
        {/* <ProductListingSkeleton /> */}
        {isFetching && <ProductListingSkeleton />}
        <div className="sticky bottom-2 z-10 hidden pt-16 lg:block">
          <div className={cn('flex items-center justify-center gap-2')}>
            <ShopFilterPagination totalProducts={totalProducts} />
          </div>
        </div>
        <ShopFilterStickyMenuMobile totalProducts={totalProducts} />
      </div>
    </>
  );
};
export default Shop;
