import { User2 } from 'lucide-react';
import { Button } from '../UI/Button';
import Logo from '../UI/Logo';
import HamburgerMenu from './HamburgerMenu';
import NavCartDropdown from './NavCartDropdown';
import SearchMenu from './SearchMenu';
import MobileUserMenu from './MobileUserMenu';
import MobileUserMenuWrapper from './MobileUserMenuWrapper';
import { Suspense } from 'react';

const MobileMenu = async () => {
  return (
    <div className="relative flex h-full items-center justify-between xl:hidden">
      <div className="-ml-2">
        <HamburgerMenu />
        <Suspense>
          <MobileUserMenuWrapper />
        </Suspense>
      </div>
      <Logo className="absolute left-1/2 -translate-x-1/2" />
      <div className="-mr-2">
        <SearchMenu />
        <NavCartDropdown />
      </div>
    </div>
  );
};
export default MobileMenu;
