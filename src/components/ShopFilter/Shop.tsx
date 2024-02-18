'use client';

import { useShopQuery } from '@/lib/hooks/useShopFilter';
import FilterProductsStatusText from './FilterProductsStatusText';
import FilterSelectedTags from './FilterSelectedTags';
import { ProductListing } from './ProductListing';
import ShopFilterBottomMenu from './ShopFilterBottomMenu';
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
        {isFetching && <ProductListingSkeleton />}
        <ShopFilterBottomMenu totalProducts={totalProducts} />
      </div>
    </>
  );
};
export default Shop;
