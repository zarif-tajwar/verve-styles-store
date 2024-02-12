import { dedupedAuth } from '@/auth';
import CartMenu from './CartMenu';
import NavUserDropdown from './NavUserDropdown';

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
