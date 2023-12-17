import { SignInButton, UserProfile } from '@clerk/nextjs';
import NavCartDropdown from './NavCartDropdown';
import NavUserDropdown from './NavUserDropdown';

const NavDropdownMenuWrap = async () => {
  return (
    <div className="-mx-2 flex items-center">
      <NavCartDropdown />
      <NavUserDropdown />
    </div>
  );
};
export default NavDropdownMenuWrap;
