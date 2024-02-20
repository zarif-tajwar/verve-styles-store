import Link from 'next/link';
import { Suspense } from 'react';
import { Container } from '../UI/Container';
import Logo from '../UI/Logo';
import SearchProduct from '../UI/SearchProduct';
import HamburgerMenu from './HamburgerMenu';
import MobileUserMenuWrapper from './MobileUserMenuWrapper';
import NavDropdownMenuWrap from './NavDropdownMenuWrap';
import NavLinks from './NavLinks';

const Navbar = () => {
  return (
    <header
      id="navbar"
      className="[&:not(:has(~_*_[data-no-nav-border),:has(~_[data-no-nav-border))]:border-none top-0 z-10 border-b  border-primary-50 bg-primary-0 [&:not(:has(~_*_[data-no-sticky-nav]),:has(~_[data-no-sticky-nav]))]:sticky"
    >
      <Container asChild className="h-[var(--nav-height)]">
        <nav>
          <div className="flex h-full items-center justify-between lg:justify-start lg:gap-10">
            <div className="-ml-2 lg:hidden">
              <HamburgerMenu />
              <Suspense
                fallback={
                  <span className="inline-block size-10 animate-pulse rounded-full bg-primary-100"></span>
                }
              >
                <MobileUserMenuWrapper />
              </Suspense>
            </div>
            <Link href={'/'}>
              <Logo />
            </Link>
            <div className="flex items-center gap-10 lg:flex-grow">
              <NavLinks />
              <div className="hidden flex-grow items-center justify-end lg:flex">
                <SearchProduct />
              </div>
              <Suspense
                fallback={
                  <span className="-mx-2 inline-block h-10 w-20 animate-pulse rounded-full bg-primary-100"></span>
                }
              >
                <NavDropdownMenuWrap />
              </Suspense>
            </div>
          </div>
        </nav>
      </Container>
    </header>
  );
};
export default Navbar;
