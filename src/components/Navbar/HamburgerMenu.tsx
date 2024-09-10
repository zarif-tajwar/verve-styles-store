'use client';

import { GithubOutlineIcon, Hamburger } from '@/components/Svgs/icons';
import { Button } from '@/components/UI/Button';
import { ScrollArea } from '@/components/UI/ScrollArea';
import { cn } from '@/lib/util';
import {
  HomeIcon,
  ShoppingBagIcon,
  SparklesIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import * as Dialog from '@radix-ui/react-dialog';
import Link from 'next/link';

const HamburgerMenu = () => {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <Button variant={'inverse'} size={'square'} className="group">
          <Hamburger className="group-data-[state=open]:hidden" />
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
                    <SparklesIcon className="size-6" />
                    <h3 className="text-2xl font-semibold">Explore</h3>
                  </div>
                  <div className="grid gap-4">
                    <Dialog.Close asChild>
                      <Button
                        variant={'secondary'}
                        align={'left'}
                        className="gap-3"
                        size={'md'}
                        asChild
                      >
                        <Link href={'/'}>
                          <HomeIcon className="size-5" /> Homepage
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
                        <Link href={'/shop'}>
                          <ShoppingBagIcon className="size-5" /> Shop
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
                        <Link
                          href={
                            'https://github.com/zarif-tajwar/verve-styles-store'
                          }
                        >
                          <GithubOutlineIcon
                            className="size-5"
                            strokeWidth={1.8}
                          />
                          Github
                        </Link>
                      </Button>
                    </Dialog.Close>
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

export default HamburgerMenu;
