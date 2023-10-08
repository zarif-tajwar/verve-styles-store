import SearchProduct from '../UI/SearchProduct';
import { Icons } from '../Svgs/icons';
import Link from 'next/link';

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

const navLinksList = [
  { title: 'Shop', href: '/shop' },
  { title: 'On Sale', href: '/' },
  { title: 'New Arrivals', href: '/' },
  { title: 'Brands', href: '/' },
];

const NavLinks = () => (
  <div className="-mx-3">
    <ul className="flex items-center">
      {navLinksList.map((link) => (
        <li key={link.title} className="inline-block">
          <Link
            href={link.href}
            className="px-3 py-2 text-black/70 transition-colors hover:text-black"
            prefetch={false}
          >
            {link.title}
          </Link>
        </li>
      ))}
    </ul>
  </div>
);
