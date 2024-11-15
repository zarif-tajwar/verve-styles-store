'use client';

import useCartDrawerOpen from '@/lib/hooks/useCartDrawerOpen';
import { cn } from '@/lib/util';
import { XMarkIcon } from '@heroicons/react/20/solid';
import { Suspense } from 'react';
import Cart from '../Cart/Cart';
import { CartIcon } from '../Svgs/icons';
import { Button } from '../UI/Button';
import { Container } from '../UI/Container';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTrigger,
} from '../UI/Drawer';
import CartCount from './CartCount';

const CartMenuClient = () => {
  const { isOpen, handleOpenChange } = useCartDrawerOpen();
  return (
    <Drawer open={isOpen} onOpenChange={handleOpenChange}>
      <DrawerTrigger asChild>
        <Button
          size={'square'}
          variant={'ghost'}
          className="text-primary-500 ring-offset-0 data-[state=open]:bg-primary-50"
          aria-label="Trigger Cart Dropdown Menu"
        >
          <span className="relative z-10 justify-center">
            {
              <>
                <CartIcon />
                <CartCount />
              </>
            }
          </span>
        </Button>
      </DrawerTrigger>
      <DrawerContent
        className={cn(
          'h-[calc(95dvh-var(--close-size)-16px)] w-screen rounded-t-main [--close-size:2.5rem] portrait:h-[calc(100dvh-var(--close-size)-16px)]',
          'landscape:[@media(height<720px)]:h-[calc(100dvh-var(--close-size)-16px)]',
        )}
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <Container>
          <div className="relative">
            <DrawerClose className="absolute -top-2 right-0 inline-flex size-[var(--close-size)] -translate-y-full items-center justify-center rounded-full bg-primary-0 text-primary-500 transition-colors duration-200 hover:bg-primary-50">
              <XMarkIcon className="size-6" />
            </DrawerClose>
          </div>
        </Container>
        <Container className="h-full px-2 landscape:[@media(height<625px)]:overflow-auto">
          <div
            className={cn(
              'relative grid h-full w-full grid-cols-1 grid-rows-[auto_1fr]',
              'landscape:[@media(height<625px)]:block',
            )}
          >
            <div className="flex justify-center pt-2.5 sm:pt-4 md:pt-5">
              <span className="mx-auto inline-block h-2.5 w-24 rounded-full bg-primary-100 sm:h-3 sm:w-28 md:w-36"></span>
            </div>
            <div className="pb-2 pt-4 sm:pt-5 md:pb-6 md:pt-6 xl:pt-8">
              <Cart deliveryCharge={25} />
            </div>
          </div>
        </Container>
      </DrawerContent>
    </Drawer>
  );
};

const CartMenu = () => {
  return (
    <Suspense>
      <CartMenuClient />
    </Suspense>
  );
};

export default CartMenu;
