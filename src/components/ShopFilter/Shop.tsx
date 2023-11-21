'use client';

import FilterProductsStatusText from './FilterProductsStatusText';
import { getShopProductsServer } from '@/lib/actions/shop';
import ShopFilterPagination from './ShopFilterPagination';
import { useQuery } from '@tanstack/react-query';
import { useShopFilter } from '@/lib/hooks/useShopFilter';
import { SHOP_FILTER_PRODUCTS_QUERY_KEY } from '@/lib/constants/query-keys';
import ProductListing from './ProductListing';
import { ProductListingSkeleton } from './Skeleton';
import { wait } from '@/lib/util';
import { Button } from '../UI/Button';
import { useState } from 'react';

const Shop = () => {
  const paramsStateSerialized = useShopFilter(
    (store) => store.paramsStateSerialized,
  );
  const [testLoading, setTestLoading] = useState(false);

  const queryKey = [SHOP_FILTER_PRODUCTS_QUERY_KEY, paramsStateSerialized];

  const { data: productItems, isLoading } = useQuery({
    queryKey,
    queryFn: async () => {
      // await wait(300);
      const data = await getShopProductsServer(paramsStateSerialized);
      return data || [];
    },
  });

  const totalProducts = productItems?.at(0)?.totalCount;

  console.log('SHOP PARENT GRID RENDERED');

  return (
    <>
      <div className="absolute -top-28 left-1/2 mx-auto flex w-max min-w-[19rem] -translate-x-1/2 grid-cols-2 flex-col justify-center gap-4 rounded-main p-4 ring-1 ring-primary-100">
        <p className="col-span-2">Temporary Buttons for Testing</p>
        {/* <Button>Add Delay</Button> */}
        <Button variant={'outline'} onClick={() => setTestLoading((x) => !x)}>
          {testLoading ? 'Stop Loading' : 'Trigger Loading'}
        </Button>
      </div>
      <div className="col-start-1 row-start-1">
        <FilterProductsStatusText totalProducts={totalProducts} />
      </div>
      <div className="relative col-span-2 h-max">
        {!(isLoading || testLoading) && (
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
        {(isLoading || testLoading) && (
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
