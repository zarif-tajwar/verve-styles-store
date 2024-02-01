'use client';

import { getShopProductsAction } from '@/lib/actions/shop';
import { SHOP_FILTER_PRODUCTS_QUERY_KEY } from '@/lib/constants/query-keys';
import { useShopFilter } from '@/lib/hooks/useShopFilter';
import { useQuery } from '@tanstack/react-query';
import FilterProductsStatusText from './FilterProductsStatusText';
import ProductListing from './ProductListing';
import ShopFilterPagination from './ShopFilterPagination';
import { ProductListingSkeleton } from './Skeleton';

const Shop = () => {
  const paramsStateSerialized = useShopFilter(
    (store) => store.paramsStateSerialized,
  );

  const queryKey = [SHOP_FILTER_PRODUCTS_QUERY_KEY, paramsStateSerialized];

  const { data: productItems, isFetching } = useQuery({
    queryKey,
    queryFn: async () => {
      const data = await getShopProductsAction(paramsStateSerialized);
      return data || [];
    },
    placeholderData: (prevData) => prevData,
  });

  const totalProducts = productItems?.at(0)?.totalCount;

  return (
    <>
      <div className="col-start-1 row-start-1">
        <FilterProductsStatusText totalProducts={totalProducts} />
      </div>
      <div className="relative col-span-2 h-max">
        {!isFetching && (
          <div
            key={'products'}
            className="relative z-0 grid grid-cols-3 gap-x-5 gap-y-9"
          >
            {productItems?.map((product, i) => {
              const uniqueKey =
                product.name + product.price + product.categoryName;
              return <ProductListing key={uniqueKey} i={i} product={product} />;
            })}
          </div>
        )}
        {isFetching && (
          <div
            key={'skeleton'}
            className="z-50 grid w-full animate-pulse grid-cols-3 gap-x-5 gap-y-9"
          >
            {[...Array(9).keys()].map((_, i) => (
              <ProductListingSkeleton key={i + 'skeleton'} />
            ))}
          </div>
        )}
        <div className="sticky bottom-4 z-50 pt-16">
          <ShopFilterPagination totalProducts={totalProducts} />
        </div>
      </div>
    </>
  );
};
export default Shop;
