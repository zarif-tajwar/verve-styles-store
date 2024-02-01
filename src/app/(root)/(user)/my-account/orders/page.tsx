import { dedupedAuth } from '@/auth';
import ClientSessionProvider from '@/lib/provider/client-session-provider';
import { redirect } from 'next/navigation';
import OrderFilters from './OrderFilters';
import OrdersListing from './OrdersListing';

const OrdersPage = async () => {
  const session = await dedupedAuth();
  if (!session) {
    redirect('/auth/sign-in');
  }

  return (
    <ClientSessionProvider session={session}>
      <div className="w-full">
        <div className="relative mb-8">
          <h1 className="text-3xl font-semibold">Order History</h1>
          {/* <GenRanOrderBtn /> */}
        </div>
        <OrderFilters />
        <OrdersListing />
      </div>
    </ClientSessionProvider>
  );
};
export default OrdersPage;
