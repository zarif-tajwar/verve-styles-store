'use client';

import Link from 'next/link';
import CartCount from './CartCount';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import * as ScrollArea from '@radix-ui/react-scroll-area';
import { Button, buttonVariants } from '../UI/Button';
import { capitalize, cn } from '@/lib/util';
import Divider from '../UI/Divider';

const NavCartDropdown = () => {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <Button
          size={'square'}
          variant={'ghost'}
          className="text-primary-500 ring-offset-0 data-[state=open]:scale-75 data-[state=open]:bg-primary-50"
        >
          <span className="relative z-10 inline-flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-6 w-6"
            >
              <path
                fillRule="evenodd"
                d="M7.5 6v.75H5.513c-.96 0-1.764.724-1.865 1.679l-1.263 12A1.875 1.875 0 004.25 22.5h15.5a1.875 1.875 0 001.865-2.071l-1.263-12a1.875 1.875 0 00-1.865-1.679H16.5V6a4.5 4.5 0 10-9 0zM12 3a3 3 0 00-3 3v.75h6V6a3 3 0 00-3-3zm-3 8.25a3 3 0 106 0v-.75a.75.75 0 011.5 0v.75a4.5 4.5 0 11-9 0v-.75a.75.75 0 011.5 0v.75z"
                clipRule="evenodd"
              />
            </svg>
            {/* <CartCount /> */}
          </span>
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={4}
          className={cn(
            'origin-top-right rounded-xl bg-primary-0 text-sm font-normal shadow-drop',
            'data-[state=closed]:animate-shrinkToTopRightAnim data-[state=open]:animate-scaleFromTopRightAnim',
          )}
        >
          <ScrollArea.Root className="h-[20rem] min-w-[24rem] rounded-lg px-4 pt-4">
            <ScrollArea.Viewport className="h-full w-full rounded-t-lg">
              {[...Array(5).keys()].map((_, i, arr) => {
                const sizeName = 'Medium';
                return (
                  <div key={i} className="border-0 outline-none ring-0">
                    <div
                      className={cn(
                        'relative grid min-h-[4rem] grid-cols-3 gap-4',
                        i === arr.length - 1 && 'pb-4',
                      )}
                    >
                      {/* IMAGE */}
                      <div className="row-span-2 aspect-square rounded-lg bg-primary-50"></div>
                      <div className="col-span-2 flex flex-col items-start justify-start gap-1.5">
                        {/* PRODUCT NAME */}
                        <span className="block text-base font-medium">
                          Branded Black T-Shirt
                        </span>
                        {/* ATTRIBUTES */}
                        <span className="inline-flex min-w-[3rem] items-center justify-center rounded-full px-2 py-0.5 text-xs font-normal tracking-wide text-primary-400 ring-1 ring-primary-100">
                          {sizeName.length > 3
                            ? capitalize(sizeName)
                            : sizeName.toUpperCase()}
                        </span>
                      </div>
                      {/* QUANTITY */}
                      <span className="inline-flex items-end">Quantity: 3</span>
                      {/* TOTAL PRICE */}
                      <span className="inline-flex items-end font-medium text-primary-500">
                        $9999.99
                      </span>
                      {/* {i < arr.length - 1 && (
                        <div className="absolute bottom-0 left-0 w-full px-3">
                          <Divider className="w-full bg-primary-50" />
                        </div>
                      )} */}
                    </div>
                    {i < arr.length - 1 && (
                      <Divider className="my-4 w-full bg-primary-50" />
                    )}
                  </div>
                );
              })}
            </ScrollArea.Viewport>
            <ScrollArea.Scrollbar
              className="flex w-2.5 touch-none select-none rounded-b-lg rounded-r-lg bg-primary-50 p-0.5 transition-colors duration-[160ms] ease-out hover:bg-primary-100"
              orientation="vertical"
            >
              <ScrollArea.Thumb className="relative flex-1 rounded-[10px] bg-primary-200 before:absolute before:left-1/2 before:top-1/2 before:h-full before:min-h-[44px] before:w-full before:min-w-[44px] before:-translate-x-1/2 before:-translate-y-1/2 before:content-['']" />
            </ScrollArea.Scrollbar>
          </ScrollArea.Root>
          <DropdownMenu.Group
            className={cn(
              'rounded-b-xl rounded-bl-xl bg-primary-900 px-4 py-3',
              // 'grid grid-cols-2 items-start justify-start',
              'flex items-center justify-between',
            )}
          >
            <Button
              roundness={'lg'}
              variant={'inverse'}
              asChild
              className="w-max focus-visible:ring-0 focus-visible:ring-offset-0"
            >
              <DropdownMenu.DropdownMenuItem asChild>
                <Link href={'/cart'}>
                  Go To Cart
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="h-5 w-5"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Link>
              </DropdownMenu.DropdownMenuItem>
            </Button>
            <div className="flex flex-col items-end justify-between gap-1 text-primary-0">
              <span>Total Price</span>
              <span className="text-base">$9999999.99</span>
            </div>
          </DropdownMenu.Group>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};

export default NavCartDropdown;
