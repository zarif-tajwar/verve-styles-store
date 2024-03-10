'use client';

import { useShopQuery } from '@/lib/hooks/useShopFilter';
import FilterProductsStatusText from './FilterProductsStatusText';
import FilterSelectedTags from './FilterSelectedTags';
import NoProductsFound from './NoProductsFound';
import { ProductListing } from './ProductListing';
import ShopFilterBottomMenu from './ShopFilterBottomMenu';
import { ProductListingSkeleton } from './Skeleton';

const Shop = () => {
  const { data: productItems, isFetching } = useShopQuery();

  const totalProducts = productItems?.at(0)?.totalCount;

  const showProducts = !isFetching && productItems && productItems.length > 0;

  const showLoading = isFetching;

  const showNoProductsFound =
    !isFetching && productItems && productItems.length === 0;

  return (
    <>
      <div className="col-span-2 col-start-1 row-start-1 lg:col-span-1">
        <FilterSelectedTags />
        {showProducts && (
          <FilterProductsStatusText totalProducts={totalProducts} />
        )}
      </div>
      <div className="relative col-span-2 h-max">
        {showProducts && <ProductListing products={productItems} />}
        {showLoading && <ProductListingSkeleton />}
        {showNoProductsFound && <NoProductsFound />}
        {!showNoProductsFound && (
          <ShopFilterBottomMenu totalProducts={totalProducts} />
        )}
      </div>
    </>
  );
};
export default Shop;
