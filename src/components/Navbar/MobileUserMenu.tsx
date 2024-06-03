'use client';

import { useAuthQuery } from '@/lib/queries/auth';
import { cn } from '@/lib/util';
import { XMarkIcon } from '@heroicons/react/24/outline';
import * as Dialog from '@radix-ui/react-dialog';
import { FileClockIcon, LogIn, LogOutIcon, User2 } from 'lucide-react';
import Link from 'next/link';
import { Suspense } from 'react';
import { Button } from '../UI/Button';
import { ScrollArea } from '../UI/ScrollArea';
import SignInLink from '../auth/SignInLink';

const MobileUserMenu = () => {
  return (
    <Suspense
      fallback={
        <div className="size-10 animate-pulse rounded-full bg-primary-100"></div>
      }
    >
      <MobileUserMenuClient />
    </Suspense>
  );
};

const MobileUserMenuClient = () => {
  const { data: user, isLoading } = useAuthQuery();

  if (user === undefined || isLoading)
    return (
      <div className="size-10 animate-pulse rounded-full bg-primary-100"></div>
    );

  const isLoggedIn = user !== null;

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <Button variant={'inverse'} size={'square'} className="group">
          <User2 className="group-data-[state=open]:hidden" />
          <XMarkIcon
            className="size-6 group-data-[state=closed]:hidden"
            strokeWidth={2}
          />
        </Button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.DialogOverlay className="h-full w-full" />
        <Dialog.Content
          className={cn(
            'fixed left-0 top-[var(--nav-height)] z-50 h-[calc(100dvh-var(--nav-height))] w-screen border-t border-primary-100 bg-primary-0',
            'origin-top data-[state=closed]:duration-200 data-[state=open]:duration-300 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=open]:fade-in data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
          )}
        >
          <ScrollArea className="h-full max-h-[calc(100svh-var(--nav-height))] w-full">
            <div className="h-full w-full px-4 py-10 md:px-8">
              <div className="h-full w-full">
                <div className="">
                  <div className="mb-6 flex items-center gap-2">
                    <User2 className="size-6" />
                    <h3 className="text-2xl font-semibold">Account</h3>
                  </div>
                  <div className="grid gap-4">
                    {!isLoggedIn && (
                      <Dialog.Close asChild>
                        <Button
                          variant={'secondary'}
                          align={'left'}
                          className="gap-3"
                          size={'md'}
                          asChild
                        >
                          <SignInLink redirectAfter="same-url">
                            <LogIn className="size-5" /> Sign In
                          </SignInLink>
                        </Button>
                      </Dialog.Close>
                    )}
                    {isLoggedIn && (
                      <>
                        <Dialog.Close asChild>
                          <Button
                            variant={'secondary'}
                            align={'left'}
                            className="gap-3"
                            size={'md'}
                            asChild
                          >
                            <Link href={'/my-account/orders'}>
                              <FileClockIcon
                                className="size-5"
                                strokeWidth={1.5}
                              />{' '}
                              Orders
                            </Link>
                          </Button>
                        </Dialog.Close>
                        <Dialog.Close asChild>
                          <Button
                            variant={'secondary'}
                            align={'left'}
                            className="gap-3"
                            size={'md'}
                            asChild
                          >
                            <Link href={'/my-account'}>
                              <User2 className="size-5" strokeWidth={1.5} />{' '}
                              View Account
                            </Link>
                          </Button>
                        </Dialog.Close>
                        <Dialog.Close asChild>
                          <Button
                            variant={'secondary'}
                            align={'left'}
                            className="gap-3"
                            size={'md'}
                            asChild
                          >
                            <a href="/api/auth/logout">
                              <LogOutIcon
                                className="size-5"
                                strokeWidth={1.5}
                              />{' '}
                              Logout
                            </a>
                          </Button>
                        </Dialog.Close>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </ScrollArea>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default MobileUserMenu;
