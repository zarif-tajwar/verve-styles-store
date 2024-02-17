'use client';

import { SHOP_FILTER_PRODUCTS_QUERY_KEY } from '@/lib/constants/query-keys';
import { useShopFilter } from '@/lib/hooks/useShopFilter';
import { FilteredProductItem } from '@/lib/server/shop';
import { useQuery } from '@tanstack/react-query';
import { errorToast } from '../UI/Toaster';
import FilterProductsStatusText from './FilterProductsStatusText';
import { ProductListing } from './ProductListing';
import ShopFilterPagination from './ShopFilterPagination';
import { ProductListingSkeleton } from './Skeleton';
import FilterSelectedTags from './FilterSelectedTags';

const Shop = () => {
  const filterUseQueryKey = useShopFilter((store) => store.filterUseQueryKey);

  const filterParamsSerialized = useShopFilter(
    (store) => store.filterParamsSerialized,
  );

  const url = `/api/shop${filterParamsSerialized}`;

  const queryKey = [SHOP_FILTER_PRODUCTS_QUERY_KEY, filterUseQueryKey];

  console.log(url, 'API URL');
  console.log(queryKey, 'REACT QUERY KEY');

  const { data: productItems, isFetching } = useQuery({
    queryKey,
    queryFn: async () => {
      let products: FilteredProductItem[] = [];
      try {
        const res = await fetch(url);
        if (!res.ok) {
          throw new Error();
        } else {
          products = (await res.json()).data;
        }
      } catch (error) {
        errorToast('Something went wrong while fetching the products!');
      }
      return products;
    },
    placeholderData: (prevData) => prevData,
  });

  const totalProducts = productItems?.at(0)?.totalCount;

  return (
    <>
      <div className="col-start-1 row-start-1">
        <FilterSelectedTags />
        <FilterProductsStatusText totalProducts={totalProducts} />
      </div>
      <div className="relative col-span-2 h-max">
        {!isFetching && productItems && (
          <ProductListing products={productItems} />
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
