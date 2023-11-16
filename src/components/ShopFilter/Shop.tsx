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
import { useQueryState } from 'next-usequerystate';
import useQueryParams from '@/lib/hooks/useQueryParams';

const Shop = () => {
  const [queryState, setQueryState] = useQueryState('clothing');

  const {
    data: productItems,
    isRefetching,
    refetch,
  } = useQuery({
    queryKey: queryKeys.SHOP_FILTER_PRODUCTS,
    queryFn: async () => {
      //   setQueryState('lol');
      await wait(1000);
      const data = [];
      //   const data = await getShopProductsServer({});
      return data;
    },
  });

  console.log('PRODUCT LISTING PARENT RENDERED');
  console.log(productItems, 'PRODUCT ITEMS');
  //   console.log(queryState, 'CLOTHING');
  console.log(isRefetching, 'IS REFETCHING');

  const pageNum = 1;
  //   const pageNum = Number.parseInt(searchParamsSerialized.page as string) || 1;
  const totalProducts = productItems?.at(0)?.totalCount || 0;

  return (
    <>
      <div className="col-start-1 row-start-1">
        <FilterProductsStatusText
          page={pageNum}
          totalProducts={totalProducts}
        />
      </div>
      <div className="col-span-2">
        <div className="grid grid-cols-3 gap-x-5 gap-y-9">
          {productItems?.map((product, i) => {
            return <ProductListing key={i} product={product} />;
          })}
        </div>
        <div className="pt-16">
          <ShopFilterPagination totalProducts={totalProducts} />
          <button onClick={() => refetch()}>Temp Button</button>
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
