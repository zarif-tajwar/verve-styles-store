import { cn } from '@/lib/util';
import { Slot } from '@radix-ui/react-slot';
import Link from 'next/link';
import React from 'react';

export interface AuthSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  asChild?: boolean;
}

export const AuthSection = React.forwardRef<HTMLDivElement, AuthSectionProps>(
  ({ className, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'div';

    return (
      <div className="rounded-main bg-primary-0 shadow-sm">
        <Comp
          className={cn('mx-auto w-full max-w-sm py-20', className)}
          ref={ref}
          {...props}
        />
      </div>
    );
  },
);

AuthSection.displayName = 'AuthSection';

export interface AuthHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  heading: string;
  description?: string;
}

export const AuthHeader = React.forwardRef<HTMLDivElement, AuthHeaderProps>(
  ({ className, heading, description, ...props }, ref) => {
    return (
      <div className={cn('mb-8', className)} ref={ref} {...props}>
        <Link
          href={'/shop'}
          className="mb-4 inline-flex aspect-square size-10 items-center justify-center rounded-md bg-primary-900 text-2xl font-bold text-primary-0 opacity-100"
        >
          V
        </Link>
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold">{heading}</h1>
          {description && (
            <p className="text-lg text-primary-400">{description}</p>
          )}
        </div>
      </div>
    );
  },
);

AuthHeader.displayName = 'AuthHeader';
