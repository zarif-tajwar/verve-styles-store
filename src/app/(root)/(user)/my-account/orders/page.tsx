import { auth } from '@/auth';
import WIP from '@/components/UI/WIP';
import { redirect } from 'next/navigation';
import OrdersListing from './OrdersListing';
import OrderFilters from './OrderFilters';
import GenRanOrderBtn from './GenRanOrderBtn';
import { SessionProvider } from 'next-auth/react';

const OrdersPage = async () => {
  const session = await auth();
  if (!session) {
    redirect('/auth/sign-in');
  }
  return (
    <SessionProvider session={session}>
      <div className="w-full">
        <div className="relative mb-8">
          <h1 className="text-3xl font-semibold">Order History</h1>
          {/* <GenRanOrderBtn /> */}
        </div>
        <OrderFilters />
        <OrdersListing session={session} />
      </div>
    </SessionProvider>
  );
};
export default OrdersPage;
