import { Suspense } from 'react';
import SearchProduct from '../UI/SearchProduct';
import NavDropdownMenuWrap from './NavDropdownMenuWrap';
import NavLinks from './NavLinks';
import Link from 'next/link';
import Logo from '../UI/Logo';

const DesktopMenu = async () => {
  return (
    <div className="hidden h-full items-center gap-10 xl:flex">
      <Link href={'/'}>
        <Logo />
      </Link>
      <div className="flex flex-grow items-center gap-10">
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
    </div>
  );
};
export default DesktopMenu;
