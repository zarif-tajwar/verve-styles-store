import { dedupedAuth } from '@/auth';
import MobileUserMenu from './MobileUserMenu';

const MobileUserMenuWrapper = async () => {
  const session = await dedupedAuth();
  return <MobileUserMenu isLoggedIn={!!session} />;
};
export default MobileUserMenuWrapper;
