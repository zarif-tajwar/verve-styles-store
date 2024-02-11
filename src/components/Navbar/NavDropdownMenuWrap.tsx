import { dedupedAuth } from '@/auth';
import ClientSessionProvider from '@/lib/provider/client-session-provider';
import NavCartDropdown from './NavCartDropdown';
import NavUserDropdown from './NavUserDropdown';
import CartMenu from './CartMenu';

const NavDropdownMenuWrap = async () => {
  const session = await dedupedAuth();
  return (
    <div className="-mx-2 flex items-center">
      {/* <NavCartDropdown /> */}
      <CartMenu />
      <NavUserDropdown user={session?.user} />
    </div>
  );
};

export default NavDropdownMenuWrap;
