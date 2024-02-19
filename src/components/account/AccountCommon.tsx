import { cn } from '@/lib/util';
import { Slot } from '@radix-ui/react-slot';
import React from 'react';

interface AccountHeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  asChild?: boolean;
}

export const AccountHeading = React.forwardRef<
  HTMLHeadingElement,
  AccountHeadingProps
>(({ className, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : 'h1';
  return (
    <Comp
      className={cn('text-2xl font-semibold sm:text-3xl', className)}
      ref={ref}
      {...props}
    />
  );
});

AccountHeading.displayName = 'AccountHeading';

interface AccountHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

export const AccountHeader = React.forwardRef<
  HTMLDivElement,
  AccountHeaderProps
>(({ className, children, ...props }, ref) => {
  return (
    <div className={cn('mb-6 sm:mb-8', className)} ref={ref} {...props}>
      {children}
    </div>
  );
});

AccountHeader.displayName = 'AccountHeader';
