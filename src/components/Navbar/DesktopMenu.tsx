import SearchProduct from '../UI/SearchProduct';
import Link from 'next/link';
import NavDropdownMenuWrap from './NavDropdownMenuWrap';
import { Button } from '../UI/Button';
import { BuildingStorefrontIcon, HomeIcon } from '@heroicons/react/16/solid';

const DesktopMenu = () => {
  return (
    <div className="flex flex-grow items-center gap-10">
      <NavLinks />
      <div className="flex flex-grow items-center justify-end">
        <SearchProduct />
      </div>
      <NavDropdownMenuWrap />
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
      {/* <li className="inline-block">
        <Link
          className="px-3 py-2 text-black/70 transition-colors hover:text-black"
          href={'/'}
        >
          On Sale
        </Link>
      </li>
      <li className="inline-block">
        <Link
          className="px-3 py-2 text-black/70 transition-colors hover:text-black"
          href={'/'}
        >
          New Arrivals
        </Link>
      </li>
      <li className="inline-block">
        <Link
          className="px-3 py-2 text-black/70 transition-colors hover:text-black"
          href={'/categories'}
        >
          Categories
        </Link>
      </li> */}
    </ul>
  </div>
);
