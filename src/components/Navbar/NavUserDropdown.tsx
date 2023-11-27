'use client';

import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { Button } from '../UI/Button';
import Link from 'next/link';
import { cn } from '@/lib/util';

const NavUserDropdown = () => {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <Button
          size={'square'}
          variant={'ghost'}
          className="text-primary-500 ring-offset-0 data-[state=open]:bg-primary-50"
          aria-label="Trigger User Dropdown Menu"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-[1.4375rem] w-[1.4375rem]"
          >
            <path
              fillRule="evenodd"
              d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z"
              clipRule="evenodd"
            />
          </svg>
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={4}
          className={cn(
            'w-44 origin-top-right rounded-xl bg-primary-0 p-2 text-sm font-normal shadow-light-drop ring-1 ring-primary-50',
            'data-[state=closed]:animate-shrinkToTopRightAnim data-[state=open]:animate-scaleFromTopRightAnim',
          )}
        >
          <DropdownMenu.DropdownMenuItem className="rounded-lg text-primary-400 data-[highlighted]:bg-primary-500 data-[highlighted]:text-primary-50 data-[highlighted]:outline-0">
            <Link
              href={'/sign-in'}
              className="inline-flex w-full items-center gap-2.5 px-2 py-3"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="h-5 w-5"
              >
                <path
                  fillRule="evenodd"
                  d="M3 4.25A2.25 2.25 0 015.25 2h5.5A2.25 2.25 0 0113 4.25v2a.75.75 0 01-1.5 0v-2a.75.75 0 00-.75-.75h-5.5a.75.75 0 00-.75.75v11.5c0 .414.336.75.75.75h5.5a.75.75 0 00.75-.75v-2a.75.75 0 011.5 0v2A2.25 2.25 0 0110.75 18h-5.5A2.25 2.25 0 013 15.75V4.25z"
                  clipRule="evenodd"
                />
                <path
                  fillRule="evenodd"
                  d="M6 10a.75.75 0 01.75-.75h9.546l-1.048-.943a.75.75 0 111.004-1.114l2.5 2.25a.75.75 0 010 1.114l-2.5 2.25a.75.75 0 11-1.004-1.114l1.048-.943H6.75A.75.75 0 016 10z"
                  clipRule="evenodd"
                />
              </svg>

              <span>Login</span>
            </Link>
          </DropdownMenu.DropdownMenuItem>
          <DropdownMenu.DropdownMenuItem className="rounded-lg text-primary-400 data-[highlighted]:bg-primary-500 data-[highlighted]:text-primary-50 data-[highlighted]:outline-0">
            <Link
              href={'/sign-up'}
              className="inline-flex w-full items-center gap-2.5 px-2 py-3"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="h-5 w-5"
              >
                <path
                  fillRule="evenodd"
                  d="M14 6a2.5 2.5 0 00-4-3 2.5 2.5 0 00-4 3H3.25C2.56 6 2 6.56 2 7.25v.5C2 8.44 2.56 9 3.25 9h6V6h1.5v3h6C17.44 9 18 8.44 18 7.75v-.5C18 6.56 17.44 6 16.75 6H14zm-1-1.5a1 1 0 01-1 1h-1v-1a1 1 0 112 0zm-6 0a1 1 0 001 1h1v-1a1 1 0 00-2 0z"
                  clipRule="evenodd"
                />
                <path d="M9.25 10.5H3v4.75A2.75 2.75 0 005.75 18h3.5v-7.5zM10.75 18v-7.5H17v4.75A2.75 2.75 0 0114.25 18h-3.5z" />
              </svg>

              <span>Sign Up</span>
            </Link>
          </DropdownMenu.DropdownMenuItem>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};

export default NavUserDropdown;
