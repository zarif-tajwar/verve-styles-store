import { Suspense } from 'react';
import Logo from '../UI/Logo';
import HamburgerMenu from './HamburgerMenu';
import MobileUserMenuWrapper from './MobileUserMenuWrapper';
import SearchMenu from './SearchMenu';
import CartMenu from './CartMenu';

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
        {/* <NavCartDropdown /> */}
        <CartMenu />
      </div>
    </div>
  );
};
export default MobileMenu;
