'use client';

import { makeValidURL, wait } from '@/lib/util';
import FilterProductsStatusText from './FilterProductsStatusText';
import { FilteredProductItem, getShopProductsServer } from '@/lib/actions/shop';
import Image from 'next/image';
import Link from 'next/link';
import Star from '../UI/Star';
import ShopFilterPagination from './ShopFilterPagination';
import { useQuery } from '@tanstack/react-query';
import * as queryKeys from '@/lib/constants/query-keys';
import { useSearchParams } from 'next/navigation';
import {
  parseAsString,
  useQueryState,
  useQueryStates,
} from 'next-usequerystate';
import useQueryParams from '@/lib/hooks/useQueryParams';
import {
  ParamsState,
  StateSchema,
  useShopFilter,
} from '@/lib/hooks/useShopFilter';
import { useEffect } from 'react';
import { shopFilterKeys } from '@/lib/validation/schemas';

const Shop = () =>
  // { initialData }: { initialData: FilteredProductItem[] }
  {
    // const productItems = useShopFilter(
    //   (store) => store.productItems,
    // initialData,
    // );
    // const isLoading = useShopFilter((store) => store.isLoading);
    // console.log('PRODUCT LISTING PARENT RENDERED');
    // console.log(productItems, 'PRODUCT ITEMS');
    // console.log(queryState, 'CLOTHING');
    // console.log(isRefetching, 'IS REFETCHING');

    const stateSchema = Object.fromEntries(
      shopFilterKeys.map((key) => [key, parseAsString]),
    ) as StateSchema;

    const [paramsState, _]: [ParamsState, any] = useQueryStates(stateSchema);

    const paramsStateSerialized = Object.fromEntries(
      Object.entries(paramsState).filter(
        ([_, val]) => val !== null && val !== '',
      ),
    ) as SearchParamsServer;

    const queryKey = [queryKeys.SHOP_FILTER_PRODUCTS];

    // const queryKey = dynamicQueryFromObj(
    //   queryKeys.SHOP_FILTER_PRODUCTS,
    //   paramsStateSerialized,
    // );

    console.log(JSON.stringify(queryKey), 'CLIENT QUERYKEY');

    const { data: productItems, isLoading } = useQuery({
      queryKey,
      queryFn: async () => {
        // await wait(1000);
        const data = await getShopProductsServer(paramsStateSerialized);
        return data || [];
      },
      // initialData: initialData || [],
    });

    if (isLoading) {
      return <div>Loading....</div>;
    }

    return (
      <>
        <div className="col-start-1 row-start-1">
          <FilterProductsStatusText />
        </div>
        <div className="col-span-2">
          <div className="grid grid-cols-3 gap-x-5 gap-y-9">
            {productItems?.map((product, i) => {
              return <ProductListing key={i} product={product} />;
            })}
          </div>
          <div className="pt-16">
            <ShopFilterPagination />
            {/* <button onClick={() => refetch()}>Temp Button</button> */}
          </div>
        </div>
      </>
    );
  };
export default Shop;

const ProductListing = ({ product }: { product: FilteredProductItem }) => {
  const ratingStr = product.averageRating || '0.0';
  const ratingFloat = Number.parseFloat(ratingStr);

  return (
    <Link
      href={`/${makeValidURL(product.categoryName!)}/${makeValidURL(
        product.name,
      )}-${product.id}`}
    >
      <div>
        <div className="mb-4 aspect-square w-full overflow-hidden rounded-main">
          <Image
            src={'/products/black-striped-tshirt.png'}
            alt="product"
            width={300}
            height={300}
            className="h-full w-full object-cover"
          />
        </div>
        <div>
          <h3 className="mb-2 text-xl font-medium capitalize">
            {product.name}
          </h3>
        </div>
        <div className="mb-2 flex gap-3">
          <Star rating={ratingFloat} size="sm" />
          <p className="text-sm font-medium text-black/60">
            <span className="text-black">{ratingStr}/</span>5.0
          </p>
        </div>
        <p className="text-2xl font-semibold">
          {new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
          }).format(Number.parseFloat(product.price))}
        </p>
      </div>
    </Link>
  );
};
