import Link from 'next/link';
import Logo from '../UI/Logo';
import DesktopMenu from './DesktopMenu';

const Navbar = () => {
  return (
    <header>
      <nav className="container-main h-[var(--nav-height)]">
        {/* <div className="flex h-full items-center gap-10">
          <Link href={'/'}>
            <Logo />
          </Link>
          <DesktopMenu />
        </div> */}
      </nav>
    </header>
  );
};
export default Navbar;
