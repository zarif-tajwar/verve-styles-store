import Link from 'next/link';
import Logo from '../UI/Logo';
import DesktopMenu from './DesktopMenu';
import { Container } from '../UI/Container';
import MobileMenu from './MobileMenu';

const Navbar = () => {
  return (
    <header>
      <Container asChild className="h-[var(--nav-height)]">
        <nav>
          <MobileMenu />
          <DesktopMenu />
        </nav>
      </Container>
    </header>
  );
};
export default Navbar;
