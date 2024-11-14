import WIP from '@/components/UI/WIP';
import { redirectIfNotSignedIn } from '@/lib/server/auth';

const AccountPage = async () => {
  await redirectIfNotSignedIn({
    redirectAfter: '/my-account',
  });
  return <WIP />;
};

export default AccountPage;
