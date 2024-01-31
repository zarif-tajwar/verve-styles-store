'use client';

import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { Button } from '../UI/Button';
import Link from 'next/link';
import { cn } from '@/lib/util';
import { FileClock, LogIn, LogOut, User2 } from 'lucide-react';
import { signOutAction } from '@/lib/actions/auth';
import React from 'react';
import Divider from '../UI/Divider';

import { useSession } from 'next-auth/react';
import Image from 'next/image';

const navDropdownItemClasses = cn(
  'rounded-lg font-medium text-primary-400',
  'data-[highlighted]:bg-primary-50 data-[highlighted]:outline-0',
  'inline-flex w-full items-center gap-2.5 px-2 py-3',
);

const truncateStr = (str: string, length: number) =>
  str.length > length ? str.slice(0, length - 1) + '...' : str;

const NavUserDropdown = () => {
  const session = useSession();
  const isLoggedIn = session.status === 'authenticated';
  const user = session.data?.user;

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
            'min-w-[13rem] origin-top-right rounded-xl bg-primary-0 p-2 text-sm font-normal shadow-light-drop ring-1 ring-primary-50',
            'data-[state=closed]:animate-shrinkToTopRightAnim data-[state=open]:animate-scaleFromTopRightAnim',
          )}
          onCloseAutoFocus={(e) => e.preventDefault()}
        >
          {!isLoggedIn || !user ? (
            <DropdownMenu.DropdownMenuItem
              className={navDropdownItemClasses}
              asChild
            >
              <Link href={'/auth/sign-in'}>
                <LogIn className="h-5 w-5" />
                <span>Login</span>
              </Link>
            </DropdownMenu.DropdownMenuItem>
          ) : (
            <>
              <DropdownMenu.Group>
                <div className="grid grid-cols-[auto_1fr] gap-2.5 py-2 pl-0.5 pr-2 outline-none">
                  {/* PROFILE IMAGE */}
                  <div className="relative aspect-square w-9 overflow-hidden rounded-full">
                    {user.name && user.email && user.image ? (
                      <Image
                        src={user.image}
                        fill
                        alt={`Profile picture of ${user.name ?? user.email}`}
                        className="h-full w-full object-cover saturate-0"
                      />
                    ) : (
                      <span className="bg-primary-50 uppercase">
                        {user.name?.at(0)}
                      </span>
                    )}
                  </div>
                  {/* PROFILE INFO */}
                  <div className="flex flex-col gap-1 leading-none">
                    {user.name && (
                      <span className="font-medium text-primary-400">
                        {truncateStr(user.name, 20)}
                      </span>
                    )}
                    {user.email && (
                      <Link
                        href={'/my-account/login-options'}
                        className="w-max border-b border-transparent text-xs text-primary-300 hover:border-primary-200"
                      >
                        {truncateStr(user.email, 20)}
                      </Link>
                    )}
                  </div>
                </div>
              </DropdownMenu.Group>
              <Divider className="my-2 bg-primary-50" />
              <DropdownMenu.Group className="flex flex-col">
                <DropdownMenu.DropdownMenuItem
                  className={navDropdownItemClasses}
                  asChild
                >
                  <Link href={'/my-account/orders'}>
                    <FileClock className="h-5 w-5" />
                    <span>Orders</span>
                  </Link>
                </DropdownMenu.DropdownMenuItem>
                <DropdownMenu.DropdownMenuItem
                  className={navDropdownItemClasses}
                  asChild
                >
                  <Link href={'/my-account'}>
                    <User2 className="h-5 w-5" />
                    <span>My Account</span>
                  </Link>
                </DropdownMenu.DropdownMenuItem>
                <DropdownMenu.DropdownMenuItem
                  className={navDropdownItemClasses}
                  asChild
                >
                  <button
                    onClick={async () => {
                      await signOutAction({ redirectTo: '/shop' });
                    }}
                  >
                    <LogOut className="h-5 w-5" />
                    <span>Logout</span>
                  </button>
                </DropdownMenu.DropdownMenuItem>
              </DropdownMenu.Group>
            </>
          )}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};

export default NavUserDropdown;
