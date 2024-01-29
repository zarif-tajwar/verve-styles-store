import { auth } from '@/auth';
import NavCartDropdown from './NavCartDropdown';
import NavUserDropdown from './NavUserDropdown';
import { SessionProvider } from 'next-auth/react';

const NavDropdownMenuWrap = async () => {
  const session = await auth();
  return (
    <div className="-mx-2 flex items-center">
      <SessionProvider session={session}>
        <NavCartDropdown />
        <NavUserDropdown />
      </SessionProvider>
    </div>
  );
};

export default NavDropdownMenuWrap;
