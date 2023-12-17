import Link from 'next/link';
import Logo from '../UI/Logo';
import DesktopMenu from './DesktopMenu';
import { UserButton } from '@clerk/nextjs';

const Navbar = () => {
  return (
    <header>
      <nav className="container-main h-24">
        <div className="flex h-full items-center gap-10">
          <Link href={'/'}>
            <Logo />
          </Link>
          <DesktopMenu />
        </div>
      </nav>
    </header>
  );
};
export default Navbar;
