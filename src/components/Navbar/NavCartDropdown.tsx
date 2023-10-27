import { BaggageClaim } from 'lucide-react';
import { Button, buttonVariants } from '../UI/Button';
import Link from 'next/link';

const NavCartDropdown = () => {
  return (
    <Link
      href={'/cart'}
      className={buttonVariants({
        size: 'square',
        variant: 'ghost',
        className: 'text-primary-500',
      })}
    >
      {/* <Button size={'square'} variant={'ghost'} className="text-primary-500"> */}
      <BaggageClaim />
      {/* </Button> */}
    </Link>
  );
};
export default NavCartDropdown;
