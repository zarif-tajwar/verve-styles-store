import { cn } from '@/lib/util';
import React from 'react';
import { Slot } from '@radix-ui/react-slot';

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  asChild?: boolean;
}

export const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  ({ className, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'div';
    return (
      <Comp
        className={cn(
          'mx-auto w-full max-w-screen-container px-4 md:px-8',
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);

Container.displayName = 'Container';
