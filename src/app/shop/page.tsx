import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from '@tanstack/react-query';
import { getShopProductsServer } from '@/lib/actions/shop';

import * as queryKeys from '@/lib/constants/query-keys';
import Shop from '@/components/ShopFilter/Shop';

const ShopPage = async ({
  searchParams,
}: {
  searchParams: SearchParamsServer;
}) => {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: queryKeys.SHOP_FILTER_PRODUCTS,
    queryFn: async () => {
      return await getShopProductsServer(searchParams);
    },
  });

  return (
    // <HydrationBoundary state={dehydrate(queryClient)}>
    <Shop />
    // </HydrationBoundary>
  );
};

export default ShopPage;
