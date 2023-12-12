import { auth } from '@/auth';
import NavCartDropdown from './NavCartDropdown';
import NavUserDropdown from './NavUserDropdown';

const NavDropdownMenuWrap = async () => {
  const session = await auth();
  const isLoggedIn = !!session;
  return (
    <div className="-mx-2 flex items-center">
      <NavCartDropdown />
      <NavUserDropdown isLoggedIn={isLoggedIn} />
    </div>
  );
};
export default NavDropdownMenuWrap;
