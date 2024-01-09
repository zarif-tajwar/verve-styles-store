import { auth } from '@/auth';
import WIP from '@/components/UI/WIP';
import { redirect } from 'next/navigation';
import OrdersListing from './OrdersListing';
import OrderFilters from './OrderFilters';

const OrdersPage = async () => {
  const session = await auth();
  if (!session) {
    redirect('/auth/sign-in');
  }
  return (
    <div className="w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold">Order History</h1>
      </div>
      <OrderFilters />
      <OrdersListing />
    </div>
  );
};
export default OrdersPage;
