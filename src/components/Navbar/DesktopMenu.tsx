import { Suspense } from 'react';
import SearchProduct from '../UI/SearchProduct';
import NavDropdownMenuWrap from './NavDropdownMenuWrap';
import NavLinks from './NavLinks';

const DesktopMenu = () => {
  return (
    <div className="hidden flex-grow items-center gap-10 xl:flex">
      <NavLinks />
      <div className="flex flex-grow items-center justify-end">
        <SearchProduct />
      </div>
      <Suspense
        fallback={
          <span className="-mx-2 inline-block h-10 w-20 animate-pulse rounded-full bg-primary-100"></span>
        }
      >
        <NavDropdownMenuWrap />
      </Suspense>
    </div>
  );
};
export default DesktopMenu;
