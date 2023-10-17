import SearchProduct from '../UI/SearchProduct';
import { CartIcon, Icons, UserIcon } from '../Svgs/icons';
import Link from 'next/link';
import ShopLink from './ShopLink';
import { BaggageClaim, User, UserCircle2 } from 'lucide-react';
import { Button } from '../UI/Button';
import NavUserDropdown from '../UI/NavUserDropdown';

const DesktopMenu = () => {
  return (
    <div className="flex flex-grow items-center gap-10">
      <NavLinks />
      <div className="flex-grow">
        <SearchProduct />
      </div>
      <div className="-mx-2 flex items-center">
        <Button size={'square'} variant={'ghost'} className="text-primary-500">
          <BaggageClaim />
        </Button>
        <NavUserDropdown />
      </div>
    </div>
  );
};
export default DesktopMenu;

const NavLinks = () => (
  <div className="-mx-3">
    <ul className="flex items-center">
      <ShopLink />
      <li className="inline-block">
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
      </li>
    </ul>
  </div>
);
