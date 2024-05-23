import {
  AccountHeader,
  AccountHeading,
} from '@/components/account/AccountCommon';
import { redirectIfNotSignedIn } from '@/lib/server/auth';
import OrderFilters from './OrderFilters';
import OrdersListing from './OrdersListing';
import { Suspense } from 'react';

const OrdersPage = async () => {
  redirectIfNotSignedIn({
    redirectAfter: '/my-account/orders',
  });

  return (
    <div className="w-full">
      <Suspense fallback={<div>Loading...</div>}>
        <OrdersForSuspense />
      </Suspense>
    </div>
  );
};
export default OrdersPage;

const OrdersForSuspense = () => {
  return (
    <>
      <AccountHeader>
        <AccountHeading>Order History</AccountHeading>
      </AccountHeader>
      <OrderFilters />
      <OrdersListing />
    </>
  );
};
