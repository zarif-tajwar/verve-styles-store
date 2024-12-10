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
      <div className="bg-primary-0 px-6 sm:rounded-main sm:shadow-sm [@media(width>=400px)]:px-8">
        <Comp
          className={cn(
            'mx-auto w-full max-w-sm py-8 sm:py-12 md:py-16 lg:py-20',
            className,
          )}
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
          className="mb-3 inline-flex aspect-square size-8 items-center justify-center rounded-md bg-primary-900 text-xl font-bold text-primary-0 opacity-100 sm:mb-4 sm:size-10 sm:text-2xl"
        >
          V
        </Link>
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold sm:text-3xl">{heading}</h1>
          {description && (
            <p className="text-base text-primary-400 sm:text-lg">
              {description}
            </p>
          )}
        </div>
      </div>
    );
  },
);

AuthHeader.displayName = 'AuthHeader';

export interface AuthFormWrapperProps
  extends React.HTMLAttributes<HTMLDivElement> {
  asChild?: boolean;
}

export const AuthFormWrapper = React.forwardRef<
  HTMLDivElement,
  AuthFormWrapperProps
>(({ className, asChild, ...props }, ref) => {
  const Comp = asChild ? Slot : 'div';

  return (
    <Comp
      className={cn('mb-8 flex flex-col justify-end gap-y-8', className)}
      ref={ref}
      {...props}
    />
  );
});

AuthFormWrapper.displayName = 'AuthFormWrapper';

export interface AuthFormFieldsWrapperProps
  extends React.HTMLAttributes<HTMLDivElement> {
  asChild?: boolean;
  revealAnimate?: boolean;
  noMinHeight?: boolean;
}

export const AuthFormFieldsWrapper = React.forwardRef<
  HTMLDivElement,
  AuthFormFieldsWrapperProps
>(({ className, asChild, revealAnimate, noMinHeight, ...props }, ref) => {
  const Comp = asChild ? Slot : 'div';
  return (
    <Comp
      className={cn(
        'flex flex-col justify-center gap-y-6 sm:min-h-[13.5rem]',
        revealAnimate &&
          'duration-500 animate-in fade-in-0 slide-in-from-bottom-10',
        noMinHeight && 'sm:min-h-0',
        className,
      )}
      ref={ref}
      {...props}
    />
  );
});

AuthFormFieldsWrapper.displayName = 'AuthFormFieldsWrapper';
