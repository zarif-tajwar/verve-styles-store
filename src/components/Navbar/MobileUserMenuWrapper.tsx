import { auth } from '@/lib/server/auth';
import MobileUserMenu from './MobileUserMenu';

const MobileUserMenuWrapper = async () => {
  const { session } = await auth();
  return <MobileUserMenu isLoggedIn={!!session} />;
};
export default MobileUserMenuWrapper;
