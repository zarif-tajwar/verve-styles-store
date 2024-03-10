import {
  AccountHeader,
  AccountHeading,
} from '@/components/account/AccountCommon';
import { redirectIfNotSignedIn } from '@/lib/server/auth';
import { SearchParamsServer } from '@/lib/types/common';
import { Suspense } from 'react';
import OrderListingSkeleton from './OrderListingSkeleton';
import Orders from './Orders';
import OrdersListing from './OrdersListing';
import OrdersPaginationServer from './OrdersPaginationServer';

const OrdersPage = async ({
  searchParams,
}: {
  searchParams: SearchParamsServer;
}) => {
  redirectIfNotSignedIn({
    redirectAfter: '/my-account/orders',
  });

  return (
    <div className="w-full">
      <AccountHeader>
        <AccountHeading>Order History</AccountHeading>
      </AccountHeader>
      <Orders
        ordersListing={
          <Suspense fallback={<OrderListingSkeleton />}>
            <OrdersListing searchParams={searchParams} />
          </Suspense>
        }
        ordersPagination={
          <OrdersPaginationServer searchParams={searchParams} />
        }
      />
    </div>
  );
};
export default OrdersPage;
