'use client';

import { signOutAction } from '@/lib/actions/auth';
import { cn } from '@/lib/util';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { FileClock, LogIn, LogOut, User2 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '../UI/Button';
import Divider from '../UI/Divider';

import { UserObjectClient } from '@/lib/types/auth';
import Image from 'next/image';
import SignInLink from '../auth/SignInLink';

const navDropdownItemClasses = cn(
  'rounded-lg font-medium text-primary-400',
  'data-[highlighted]:bg-primary-50 data-[highlighted]:outline-0',
  'inline-flex w-full items-center gap-2.5 px-2 py-3',
);

const truncateStr = (str: string, length: number) =>
  str.length > length ? str.slice(0, length - 1) + '...' : str;

const NavUserDropdown = ({ user }: { user: UserObjectClient | null }) => {
  return (
    <div className="hidden lg:block">
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <Button
            size={'square'}
            variant={'ghost'}
            className="text-primary-500 ring-offset-0 data-[state=open]:bg-primary-50"
            aria-label="Trigger User Dropdown Menu"
          >
            <User2
              className="size-[22px]"
              strokeWidth={2}
              absoluteStrokeWidth={false}
            />
          </Button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <DropdownMenu.Content
            align="end"
            sideOffset={4}
            className={cn(
              'min-w-[13rem] origin-top-right rounded-xl bg-primary-0 p-2 text-sm font-normal shadow-light-drop ring-1 ring-primary-50',
              'data-[state=open]:duration-200 data-[state=open]:animate-in data-[state=open]:fade-in data-[state=open]:zoom-in-90',
              'data-[state=closed]:duration-200 data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=closed]:zoom-out-90',
              'z-20 ease-out-back',
            )}
            onCloseAutoFocus={(e) => e.preventDefault()}
          >
            {!user ? (
              <DropdownMenu.DropdownMenuItem
                className={navDropdownItemClasses}
                asChild
              >
                <SignInLink redirectAfter="same-url">
                  <LogIn className="size-5" />
                  <span>Sign In</span>
                </SignInLink>
              </DropdownMenu.DropdownMenuItem>
            ) : (
              <>
                <DropdownMenu.Group>
                  <div className="grid grid-cols-[auto_1fr] gap-2.5 py-2 pl-0.5 pr-2 outline-none">
                    {/* PROFILE IMAGE */}
                    <div className="relative aspect-square w-9 overflow-hidden rounded-full">
                      {user.image ? (
                        <Image
                          src={user.image}
                          fill
                          alt={`Profile picture of ${user.name}`}
                          className="h-full w-full object-cover saturate-0"
                        />
                      ) : (
                        <span className="inline-flex h-full w-full items-center justify-center bg-primary-50 font-semibold uppercase text-primary-400">
                          {user.name.at(0)}
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
                      <span>View Account</span>
                    </Link>
                  </DropdownMenu.DropdownMenuItem>
                  <DropdownMenu.DropdownMenuItem
                    className={navDropdownItemClasses}
                    asChild
                  >
                    <button
                      onClick={async () => {
                        await signOutAction({});
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
    </div>
  );
};

export default NavUserDropdown;
