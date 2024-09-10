'use client';

import Link from 'next/link';
import { Button } from '../UI/Button';

const NavLinks = () => (
  <div className="-mx-3 hidden lg:block">
    <ul className="flex items-center">
      <li>
        <Button
          asChild
          variant={'ghost'}
          size={'md'}
          className="gap-2 px-5 font-medium"
        >
          <Link href={'/'}>Homepage</Link>
        </Button>
      </li>
      <li>
        <Button
          asChild
          variant={'ghost'}
          size={'md'}
          className="gap-2 px-5 font-medium"
        >
          <Link href={'/shop'}>Shop</Link>
        </Button>
      </li>
      <li>
        <Button
          asChild
          variant={'ghost'}
          size={'md'}
          className="gap-2 px-5 font-medium"
        >
          <Link href={'https://github.com/zarif-tajwar/verve-styles-store'}>
            Github
          </Link>
        </Button>
      </li>
    </ul>
  </div>
);

export default NavLinks;
