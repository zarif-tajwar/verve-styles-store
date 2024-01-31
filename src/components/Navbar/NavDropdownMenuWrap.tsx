import { dedupedAuth } from '@/auth';
import NavCartDropdown from './NavCartDropdown';
import NavUserDropdown from './NavUserDropdown';
import { SessionProvider } from 'next-auth/react';
import ClientSessionProvider from '@/lib/provider/client-session-provider';

const NavDropdownMenuWrap = async () => {
  const session = await dedupedAuth();
  return (
    <div className="-mx-2 flex items-center">
      <ClientSessionProvider session={session}>
        <NavCartDropdown />
        <NavUserDropdown />
      </ClientSessionProvider>
    </div>
  );
};

export default NavDropdownMenuWrap;
