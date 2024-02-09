import Link from 'next/link';
import { Button } from '../UI/Button';

const NavLinks = () => (
  <div className="-mx-3">
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
    </ul>
  </div>
);

export default NavLinks;
