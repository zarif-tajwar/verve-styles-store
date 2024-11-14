import {
  AccountHeader,
  AccountHeading,
} from '@/components/account/AccountCommon';
import { redirectIfNotSignedIn } from '@/lib/server/auth';
import OrderFilters from './OrderFilters';
import OrdersListing from './OrdersListing';

const OrdersPage = async () => {
  await redirectIfNotSignedIn({
    redirectAfter: '/my-account/orders',
  });

  return (
    <div className="w-full">
      <AccountHeader>
        <AccountHeading>Order History</AccountHeading>
      </AccountHeader>
      <OrderFilters />
      <OrdersListing />
    </div>
  );
};
export default OrdersPage;
