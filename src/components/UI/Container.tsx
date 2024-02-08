import { cn } from '@/lib/util';
import React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { VariantProps, cva } from 'class-variance-authority';

export interface ContainerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof containerVariants> {
  asChild?: boolean;
}

export const containerVariants = cva(
  'mx-auto w-full max-w-screen-container px-4 md:px-8',
);

export const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  ({ className, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'div';
    return (
      <Comp
        className={cn(containerVariants({}), className)}
        ref={ref}
        {...props}
      />
    );
  },
);

Container.displayName = 'Container';
