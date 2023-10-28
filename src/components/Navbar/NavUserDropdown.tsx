'use client';

import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { Button } from '../UI/Button';
import { Gift, LogIn, UserCircle2 } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/util';

const NavUserDropdown = () => {
  return (
    <DropdownMenu.Root modal={false}>
      <DropdownMenu.Trigger asChild>
        <Button
          size={'square'}
          variant={'ghost'}
          className="text-primary-500 ring-offset-0 data-[state=open]:scale-90 data-[state=open]:bg-primary-50"
        >
          <UserCircle2 />
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={4}
          className={cn(
            'w-36 origin-top-right rounded-lg bg-primary-0 p-2 text-sm font-medium shadow-light-drop ring-1 ring-primary-50',
            'data-[state=closed]:animate-shrinkToTopRightAnim data-[state=open]:animate-scaleFromTopRightAnim',
          )}
        >
          <DropdownMenu.DropdownMenuItem className="data-[highlighted]:border-0] rounded-md text-primary-500 data-[highlighted]:bg-primary-50 data-[highlighted]:outline-0">
            <Link
              href={'/login'}
              className="inline-flex w-full items-center gap-2.5 p-2"
            >
              <LogIn size={18} />
              <span>Login</span>
            </Link>
          </DropdownMenu.DropdownMenuItem>
          <DropdownMenu.DropdownMenuItem className="data-[highlighted]:border-0] rounded-md text-primary-500 data-[highlighted]:bg-primary-50 data-[highlighted]:outline-0">
            <Link
              href={'/sign-up'}
              className="inline-flex w-full items-center gap-2.5 p-2"
            >
              <Gift size={18} strokeWidth={2} />
              <span>Sign Up</span>
            </Link>
          </DropdownMenu.DropdownMenuItem>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};
export default NavUserDropdown;
