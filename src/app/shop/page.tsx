import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from '@tanstack/react-query';
import { getShopProductsServer } from '@/lib/actions/shop';

import * as queryKeys from '@/lib/constants/query-keys';
import Shop from '@/components/ShopFilter/Shop';
import { dynamicQueryFromObj } from '@/lib/validation/query-keys';

// const ShopPage = async ({
//   searchParams,
// }: {
//   searchParams: SearchParamsServer;
// }) => {
//   const queryClient = new QueryClient();
//   // const queryKey = dynamicQueryFromObj(
//   //   queryKeys.SHOP_FILTER_PRODUCTS,
//   //   searchParams,
//   // );
//   const queryKey = [queryKeys.SHOP_FILTER_PRODUCTS];

//   console.log(JSON.stringify(queryKey), 'SERVER QUERYKEY');

//   const initialData = await queryClient.fetchQuery({
//     queryKey,
//     queryFn: async () => {
//       return await getShopProductsServer(searchParams);
//     },
//   });

//   return <Shop initialData={initialData} />;
// };

const ShopPage = async ({
  searchParams,
}: {
  searchParams: SearchParamsServer;
}) => {
  // const queryKey = dynamicQueryFromObj(
  //   queryKeys.SHOP_FILTER_PRODUCTS,
  //   searchParams,
  // );
  const queryKey = [queryKeys.SHOP_FILTER_PRODUCTS];
  const queryClient = new QueryClient();

  console.log(JSON.stringify(queryKey), 'SERVER QUERYKEY');

  await queryClient.prefetchQuery({
    queryKey,
    queryFn: async () => {
      return await getShopProductsServer(searchParams);
    },
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Shop />
    </HydrationBoundary>
  );
};

export default ShopPage;
