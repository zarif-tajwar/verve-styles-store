'use client';

import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

import { cn } from '@/lib/util';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Cart } from '../Svgs/icons';
import { Button } from '../UI/Button';
import CartCount from './CartCount';
import MessageComp from './MessageComp';
import NavCartDropdownContent from './NavCartDropdownContent';
import { XMarkIcon } from '@heroicons/react/24/outline';

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
                <Cart />
                <CartCount />
              </>
            )}
            {isMenuOpen && <XMarkIcon className="size-6" strokeWidth={2} />}
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
          onCloseAutoFocus={(e) => e.preventDefault()}
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
