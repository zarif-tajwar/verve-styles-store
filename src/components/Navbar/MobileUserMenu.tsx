'use client';

import {
  HomeIcon,
  ShoppingBagIcon,
  SparklesIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import * as Dialog from '@radix-ui/react-dialog';
import { FileClockIcon, LogIn, LogOutIcon, User2 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '../UI/Button';
import { ScrollArea } from '../UI/ScrollArea';
import { signOutAction } from '@/lib/actions/auth';

const MobileUserMenu = ({ isLoggedIn }: { isLoggedIn: boolean }) => {
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
        <Dialog.Content className="fixed left-0 top-[var(--nav-height)] h-[calc(100svh-var(--nav-height))] w-screen border-t border-primary-100 bg-primary-0">
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
                          <Link href={'/auth/sign-in'}>
                            <LogIn className="size-5" /> Sign In
                          </Link>
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
                            onClick={async () => {
                              await signOutAction({ redirectTo: '/shop' });
                            }}
                          >
                            <LogOutIcon className="size-5" strokeWidth={1.5} />{' '}
                            Logout
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
