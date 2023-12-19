import { auth, signOut } from '@/auth';
import { redirect } from 'next/navigation';
import LogoutButton from './LogoutButton';
import WIP from '@/components/UI/WIP';

const AccountPage = async () => {
  // const session = await auth();

  // if (!session?.user) {
  //   redirect('/api/auth/signin?callbackUrl=/my-account');
  // }
  return <WIP />;
};

export default AccountPage;
