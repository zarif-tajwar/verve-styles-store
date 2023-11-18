'use client';

import { makeValidURL, wait } from '@/lib/util';
import FilterProductsStatusText from './FilterProductsStatusText';
import { FilteredProductItem, getShopProductsServer } from '@/lib/actions/shop';
import Image from 'next/image';
import Link from 'next/link';
import Star from '../UI/Star';
import ShopFilterPagination from './ShopFilterPagination';
import { useQuery } from '@tanstack/react-query';
import { useShopFilter } from '@/lib/hooks/useShopFilter';
import { SHOP_FILTER_PRODUCTS_QUERY_KEY } from '@/lib/constants/query-keys';
import ProductListing from './ProductListing';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { ProductListingSkeleton } from './Skeleton';

const Shop = () => {
  const [isMounted, setIsMounted] = useState(false);
  const paramsStateSerialized = useShopFilter(
    (store) => store.paramsStateSerialized,
  );

  const queryKey = [SHOP_FILTER_PRODUCTS_QUERY_KEY, paramsStateSerialized];

  const { data: productItems, isLoading } = useQuery({
    queryKey,
    queryFn: async () => {
      // await wait(200);
      const data = await getShopProductsServer(paramsStateSerialized);
      return data || [];
    },
  });

  const totalProducts = productItems?.at(0)?.totalCount;

  console.log('SHOP PARENT GRID RENDERED');

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <>
      <div className="col-start-1 row-start-1">
        <FilterProductsStatusText totalProducts={totalProducts} />
      </div>
      <div className="relative col-span-2">
        {!isLoading && (
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
        {isLoading && (
          <div
            key={'skeleton'}
            className="z-50 grid w-full animate-pulse grid-cols-3 gap-x-5 gap-y-9"
          >
            {[...Array(9).keys()].map((_, i) => (
              <ProductListingSkeleton key={i + 'skeleton'} />
            ))}
          </div>
        )}
        <div className="pt-16">
          <ShopFilterPagination totalProducts={totalProducts} />
          {/* <button onClick={() => refetch()}>Temp Button</button> */}
        </div>
      </div>
    </>
  );
};
export default Shop;
