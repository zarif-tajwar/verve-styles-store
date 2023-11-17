import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from '@tanstack/react-query';
import { getShopProductsServer } from '@/lib/actions/shop';

import Shop from '@/components/ShopFilter/Shop';
import { SHOP_FILTER_PRODUCTS_QUERY_KEY } from '@/lib/constants/query-keys';

const ShopPage = async ({
  searchParams,
}: {
  searchParams: SearchParamsServer;
}) => {
  const queryKey = [SHOP_FILTER_PRODUCTS_QUERY_KEY, searchParams];
  const queryClient = new QueryClient();

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
