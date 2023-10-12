import SearchProduct from '../UI/SearchProduct';
import { Icons } from '../Svgs/icons';
import Link from 'next/link';
import ShopLink from './ShopLink';

const DesktopMenu = () => {
  return (
    <div className="flex flex-grow items-center gap-10">
      <NavLinks />
      <div className="flex-grow">
        <SearchProduct />
      </div>
      <div className="-mx-2 flex items-center">
        <button className="px-2 py-2">
          <Icons.cart />
        </button>
        <button className="px-2 py-2">
          <Icons.user />
        </button>
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
          href={'/#reviews'}
        >
          Brands
        </Link>
      </li>
    </ul>
  </div>
);
