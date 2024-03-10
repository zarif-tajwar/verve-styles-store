import { getOrdersServer } from '@/lib/server/user';
import { SearchParamsServer } from '@/lib/types/common';
import OrdersPagination from './OrdersPagination';

const OrdersPaginationServer = async ({
  searchParams,
}: {
  searchParams: SearchParamsServer;
}) => {
  const orders = await getOrdersServer({ searchParams });
  return <OrdersPagination ordersCount={orders.length} />;
};
export default OrdersPaginationServer;
