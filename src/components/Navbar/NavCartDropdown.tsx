'use client';

import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

import { Button } from '../UI/Button';
import NavCartDropdownContent from './NavCartDropdownContent';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/util';
import { useState } from 'react';
import MessageComp from './MessageComp';
import CartCount from './CartCount';
import { BagCartIcon } from '../Svgs/icons';

const NavCartDropdown = () => {
  const path = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <DropdownMenu.Root open={isMenuOpen} onOpenChange={setIsMenuOpen}>
      <DropdownMenu.Trigger asChild>
        <Button
          size={'square'}
          variant={'ghost'}
          className="text-primary-500 ring-offset-0 data-[state=open]:bg-primary-50"
          aria-label="Trigger Cart Dropdown Menu"
        >
          {/* 'CLOSED STATE' */}
          <span className="relative z-10 justify-center">
            {!isMenuOpen && (
              <>
                <BagCartIcon />
                <CartCount />
              </>
            )}
            {isMenuOpen && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-6 w-6"
              >
                <path
                  fillRule="evenodd"
                  d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z"
                  clipRule="evenodd"
                />
              </svg>
            )}
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
          {path !== '/cart' ? (
            <NavCartDropdownContent />
          ) : (
            <DropdownMenu.DropdownMenuLabel>
              <MessageComp
                Icon={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="h-5 w-5"
                  >
                    <path d="M3.5 2.75a.75.75 0 00-1.5 0v14.5a.75.75 0 001.5 0v-4.392l1.657-.348a6.449 6.449 0 014.271.572 7.948 7.948 0 005.965.524l2.078-.64A.75.75 0 0018 12.25v-8.5a.75.75 0 00-.904-.734l-2.38.501a7.25 7.25 0 01-4.186-.363l-.502-.2a8.75 8.75 0 00-5.053-.439l-1.475.31V2.75z" />
                  </svg>
                }
                message={`You're already on the main cart page!`}
              />
            </DropdownMenu.DropdownMenuLabel>
          )}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};

export default NavCartDropdown;
