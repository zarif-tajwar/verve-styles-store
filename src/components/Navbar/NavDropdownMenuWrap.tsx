import { dedupedAuth } from '@/auth';
import CartMenu from './CartMenu';
import NavUserDropdown from './NavUserDropdown';
import SearchMenu from './SearchMenu';

const NavDropdownMenuWrap = async () => {
  const session = await dedupedAuth();
  return (
    <div className="flex items-center lg:-mx-2">
      <SearchMenu />
      <CartMenu />
      <NavUserDropdown user={session?.user} />
    </div>
  );
};

export default NavDropdownMenuWrap;
