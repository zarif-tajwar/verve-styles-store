import Logo from '../UI/Logo';
import HamburgerMenu from './HamburgerMenu';
import NavCartDropdown from './NavCartDropdown';
import SearchMenu from './SearchMenu';

const MobileMenu = () => {
  return (
    <div className="relative flex h-full items-center justify-between xl:hidden">
      <HamburgerMenu />
      <Logo className="flex-grow sm:absolute sm:left-1/2 sm:-translate-x-1/2" />
      <div className="">
        <SearchMenu />
        <NavCartDropdown />
      </div>
    </div>
  );
};
export default MobileMenu;
