import { auth } from '@/auth';
import { redirect } from 'next/navigation';

const AdminPage = async () => {
  const session = await auth();

  if (session?.user.role !== 'ADMIN') redirect('/shop');

  return <div>AdminPage</div>;
};
export default AdminPage;
