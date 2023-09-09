import Logo from '../UI/Logo';
import DesktopMenu from './DesktopMenu';

const Navbar = () => {
  return (
    <nav className="container-main h-24">
      <div className="flex h-full items-center gap-10">
        <Logo />
        <DesktopMenu />
      </div>
    </nav>
  );
};
export default Navbar;
