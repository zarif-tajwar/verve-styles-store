import { dedupedAuth } from '@/auth';
import ClientSessionProvider from '@/lib/provider/client-session-provider';
import { redirect } from 'next/navigation';
import OrderFilters from './OrderFilters';
import OrdersListing from './OrdersListing';
import {
  AccountHeader,
  AccountHeading,
} from '@/components/account/AccountCommon';

const OrdersPage = async () => {
  const session = await dedupedAuth();
  if (!session) {
    redirect('/auth/sign-in');
  }

  return (
    <ClientSessionProvider session={session}>
      <div className="w-full">
        <AccountHeader>
          <AccountHeading>Order History</AccountHeading>
        </AccountHeader>
        <OrderFilters />
        <OrdersListing />
      </div>
    </ClientSessionProvider>
  );
};
export default OrdersPage;
