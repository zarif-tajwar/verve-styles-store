import Link from 'next/link';
import Logo from '../UI/Logo';
import DesktopMenu from './DesktopMenu';
import { Container } from '../UI/Container';

const Navbar = () => {
  return (
    <header>
      <Container asChild className="h-[var(--nav-height)]">
        <nav>
          <div className="flex h-full items-center gap-10">
            <Link href={'/'}>
              <Logo />
            </Link>
            <DesktopMenu />
          </div>
        </nav>
      </Container>
    </header>
  );
};
export default Navbar;
