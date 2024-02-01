'use client';
import { useCartItemsQuery } from '@/lib/queries/cart';
import { capitalize, cn, priceFormat } from '@/lib/util';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import * as ScrollArea from '@radix-ui/react-scroll-area';
import { Loader } from 'lucide-react';
import Link from 'next/link';
import { Button } from '../UI/Button';
import Divider from '../UI/Divider';
import MessageComp from './MessageComp';

const NavCartDropdownContent = () => {
  const { data: cartItems, isLoading } = useCartItemsQuery();

  const subtotal = cartItems?.reduce(
    (acc, curr) => acc + Number.parseFloat(curr.price) * curr.quantity,
    0,
  );

  if (isLoading) {
    return (
      <div className="p4 flex h-28 w-[13rem] items-center justify-center">
        <Loader size={24} className="animate-spin text-primary-400" />
      </div>
    );
  }

  return (
    <>
      {cartItems === undefined || subtotal === undefined ? (
        <MessageComp
          Icon={
            <span className="inline-flex aspect-square h-[1.4rem] items-center justify-center rounded-full bg-primary-900 text-base leading-none text-primary-0">
              !
            </span>
          }
          message="Something went wrong!"
        />
      ) : cartItems.length === 0 ? (
        <MessageComp
          Icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-5 w-5"
            >
              <path d="M3.375 3C2.339 3 1.5 3.84 1.5 4.875v.75c0 1.036.84 1.875 1.875 1.875h17.25c1.035 0 1.875-.84 1.875-1.875v-.75C22.5 3.839 21.66 3 20.625 3H3.375z" />
              <path
                fillRule="evenodd"
                d="M3.087 9l.54 9.176A3 3 0 006.62 21h10.757a3 3 0 002.995-2.824L20.913 9H3.087zm6.133 2.845a.75.75 0 011.06 0l1.72 1.72 1.72-1.72a.75.75 0 111.06 1.06l-1.72 1.72 1.72 1.72a.75.75 0 11-1.06 1.06L12 15.685l-1.72 1.72a.75.75 0 11-1.06-1.06l1.72-1.72-1.72-1.72a.75.75 0 010-1.06z"
                clipRule="evenodd"
              />
            </svg>
          }
          message="Your shopping cart is empty!"
        />
      ) : (
        <>
          <ScrollArea.Root className="h-[20rem] min-w-[24rem] rounded-lg px-4 pt-4">
            <ScrollArea.Viewport className="h-full w-full rounded-t-lg">
              {cartItems.map((cartItem, i) => {
                return (
                  <div
                    key={cartItem.name + cartItem.price}
                    className="border-0 outline-none ring-0"
                  >
                    <div
                      className={cn(
                        'relative grid min-h-[4rem] grid-cols-3 gap-4',
                        i === cartItems.length - 1 && 'pb-4',
                      )}
                    >
                      {/* IMAGE */}
                      <div className="row-span-2 aspect-square rounded-lg bg-primary-50"></div>
                      <div className="col-span-2 flex flex-col items-start justify-start gap-1.5">
                        {/* PRODUCT NAME */}
                        <span className="block text-base font-medium">
                          {cartItem.name}
                        </span>
                        {/* ATTRIBUTES */}
                        <span className="inline-flex min-w-[3rem] items-center justify-center rounded-full px-2 py-0.5 text-xs font-normal tracking-wide text-primary-400 ring-1 ring-primary-100">
                          {cartItem.sizeName.length > 3
                            ? capitalize(cartItem.sizeName)
                            : cartItem.sizeName.toUpperCase()}
                        </span>
                      </div>
                      {/* QUANTITY */}
                      <span className="inline-flex items-end">
                        Quantity: {cartItem.quantity}
                      </span>
                      {/* TOTAL PRICE */}
                      <span className="inline-flex items-end font-medium text-primary-500">
                        {priceFormat(
                          Number.parseFloat(cartItem.price || '0') *
                            cartItem.quantity,
                        )}
                      </span>
                    </div>
                    {i < cartItems.length - 1 && (
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
              className="w-max gap-2"
            >
              <DropdownMenu.DropdownMenuItem
                className="border-none outline-none"
                asChild
              >
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
              <span>Subtotal</span>
              <span className="text-base">{priceFormat(subtotal)}</span>
            </div>
          </DropdownMenu.Group>
        </>
      )}
    </>
  );
};
export default NavCartDropdownContent;
