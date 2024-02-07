import { cn } from '@/lib/util';
import React from 'react';
import { Slot } from '@radix-ui/react-slot';

export interface SectionHeadingProps
  extends React.HTMLAttributes<HTMLHeadingElement> {
  asChild?: boolean;
}

export const SectionHeading = React.forwardRef<
  HTMLHeadingElement,
  SectionHeadingProps
>(({ className, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : 'h2';
  return (
    <Comp
      className={cn(
        'mb-10 text-center font-integral-cf text-3xl font-bold uppercase sm:mb-12 sm:text-4xl lg:mb-16 lg:text-5xl',
        className,
      )}
      ref={ref}
      {...props}
    />
  );
});

SectionHeading.displayName = 'SectionHeading';
