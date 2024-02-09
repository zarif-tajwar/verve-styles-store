'use client';

import { Hamburger } from '../Svgs/icons';
import { Button } from '../UI/Button';
// import { Dialog, DialogContent, DialogTrigger } from '../UI/Dialog';
import * as Dialog from '@radix-ui/react-dialog';
import NavLinks from './NavLinks';
import {
  BuildingStorefrontIcon,
  HomeIcon,
  ShoppingBagIcon,
  SparklesIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { LogIn, User2 } from 'lucide-react';
import * as ScrollArea from '@radix-ui/react-scroll-area';

const HamburgerMenu = () => {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <Button
          variant={'ghost'}
          size={'square'}
          className="group -ml-2 mr-4 text-primary-500"
        >
          <Hamburger className="group-data-[state=open]:hidden" />
          <XMarkIcon
            className="size-6 group-data-[state=closed]:hidden"
            strokeWidth={2}
          />
        </Button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.DialogOverlay className="h-full w-full" />
        <Dialog.Content className="fixed left-0 top-[var(--nav-height)] w-screen border-t border-primary-100 bg-primary-0 px-4 py-10 md:px-8 portrait:h-[calc(100svh-var(--nav-height))] landscape:min-h-[calc(100svh-var(--nav-height))]">
          <div className="grid h-full w-full grid-cols-1 grid-rows-2 gap-4">
            <div className="rounded-main border border-primary-100 px-4 py-4">
              <div className="mb-6 flex items-center gap-2">
                <SparklesIcon className="size-6" />
                <h3 className="text-xl font-semibold">Explore</h3>
              </div>
              <div className="grid gap-4">
                <Button
                  variant={'secondary'}
                  align={'left'}
                  className="gap-3"
                  size={'md'}
                >
                  <HomeIcon className="size-5" /> Homepage
                </Button>
                <Button
                  variant={'secondary'}
                  align={'left'}
                  className="gap-3"
                  size={'md'}
                >
                  <ShoppingBagIcon className="size-5" /> Shop
                </Button>
              </div>
            </div>
            <div className="rounded-main border border-primary-100 px-4 py-4">
              <div className="mb-6 flex items-center gap-2">
                <User2 className="size-6" />
                <h3 className="text-xl font-semibold">Account</h3>
              </div>
              <div className="grid gap-4">
                <Button
                  variant={'secondary'}
                  align={'left'}
                  className="gap-3"
                  size={'md'}
                >
                  <LogIn className="size-5" /> Sign In
                </Button>
              </div>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default HamburgerMenu;
