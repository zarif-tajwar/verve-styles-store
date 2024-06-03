import dynamic from 'next/dynamic';
import SearchMenu from './SearchMenu';

const NavUserDropdownLazy = dynamic(() => import('./NavUserDropdown'), {
  loading: () => (
    <div className="size-10 animate-pulse rounded-full bg-primary-100"></div>
  ),
});

const CartMenuLazy = dynamic(() => import('./CartMenu'), {
  loading: () => (
    <div className="size-10 animate-pulse rounded-full bg-primary-100"></div>
  ),
});

const NavDropdownMenuWrap = async () => {
  return (
    <div className="flex items-center lg:-mx-2">
      <SearchMenu />
      <CartMenuLazy />
      <NavUserDropdownLazy />
    </div>
  );
};

export default NavDropdownMenuWrap;
