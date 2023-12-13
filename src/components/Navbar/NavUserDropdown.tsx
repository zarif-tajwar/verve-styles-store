'use client';

import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { Button } from '../UI/Button';
import Link from 'next/link';
import { cn } from '@/lib/util';
import { FileClock, LogIn, LogOut, User2 } from 'lucide-react';
import { signOutAction } from '@/lib/actions/auth';

const NavUserDropdown = ({ isLoggedIn }: { isLoggedIn: boolean }) => {
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
          {!isLoggedIn ? (
            <DropdownMenu.DropdownMenuItem
              className="rounded-lg text-primary-400 data-[highlighted]:bg-primary-500 data-[highlighted]:text-primary-50 data-[highlighted]:outline-0"
              asChild
            >
              <Link
                href={'/auth/sign-in'}
                className="inline-flex w-full items-center gap-2.5 px-2 py-3"
              >
                <LogIn className="h-5 w-5" />
                <span>Login</span>
              </Link>
            </DropdownMenu.DropdownMenuItem>
          ) : (
            <>
              <DropdownMenu.DropdownMenuItem
                className="rounded-lg text-primary-400 data-[highlighted]:bg-primary-500 data-[highlighted]:text-primary-50 data-[highlighted]:outline-0"
                asChild
              >
                <Link
                  href={'/my-account'}
                  className="inline-flex w-full items-center gap-2.5 px-2 py-3"
                >
                  <FileClock className="h-5 w-5" />
                  <span>Orders</span>
                </Link>
              </DropdownMenu.DropdownMenuItem>
              <DropdownMenu.DropdownMenuItem
                className="rounded-lg text-primary-400 data-[highlighted]:bg-primary-500 data-[highlighted]:text-primary-50 data-[highlighted]:outline-0"
                asChild
              >
                <Link
                  href={'/my-account'}
                  className="inline-flex w-full items-center gap-2.5 px-2 py-3"
                >
                  <User2 className="h-5 w-5" />
                  <span>My Account</span>
                </Link>
              </DropdownMenu.DropdownMenuItem>
              <DropdownMenu.DropdownMenuItem
                className="rounded-lg text-primary-400 data-[highlighted]:bg-primary-500 data-[highlighted]:text-primary-50 data-[highlighted]:outline-0"
                asChild
              >
                <button
                  className="inline-flex w-full items-center gap-2.5 px-2 py-3"
                  onClick={async () => {
                    await signOutAction({ redirectTo: '/shop' });
                  }}
                >
                  <LogOut className="h-5 w-5" />
                  <span>Logout</span>
                </button>
              </DropdownMenu.DropdownMenuItem>
            </>
          )}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};

export default NavUserDropdown;
