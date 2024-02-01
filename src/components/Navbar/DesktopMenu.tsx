import SearchProduct from '../UI/SearchProduct';
import Link from 'next/link';
import NavDropdownMenuWrap from './NavDropdownMenuWrap';
import { Button } from '../UI/Button';
import { BuildingStorefrontIcon, HomeIcon } from '@heroicons/react/16/solid';
import { Suspense } from 'react';

const DesktopMenu = () => {
  return (
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
  );
};
export default DesktopMenu;

const NavLinks = () => (
  <div className="-mx-3">
    <ul className="flex items-center">
      <li>
        <Button asChild variant={'inverse'} className="gap-2 px-4 font-medium">
          <Link href={'/'}>
            <HomeIcon className="size-4" />
            Homepage
          </Link>
        </Button>
      </li>
      <li>
        <Button asChild variant={'inverse'} className="gap-2 px-4 font-medium">
          <Link href={'/shop'}>
            <BuildingStorefrontIcon className="size-4" />
            Shop
          </Link>
        </Button>
      </li>
    </ul>
  </div>
);
