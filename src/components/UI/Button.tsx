import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/util';

const buttonVariants = cva(
  'inline-flex items-center gap-1 text-base ring-offset-background transition-all border-none outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-30',
  {
    variants: {
      variant: {
        default:
          'bg-primary-900 text-primary-0 hover:bg-primary-500 disabled:opacity-50',
        outline:
          'ring-1 ring-primary-100 ring-inset hover:bg-primary-50 hover:ring-primary-50',
        secondary:
          'bg-primary-50 hover:bg-primary-100 text-primary-400 focus-visible:ring-offset-0',
        ghost:
          'hover:bg-primary-50 text-primary-400 focus-visible:ring-offset-0',
        inverse:
          'bg-primary-0 text-primary-900 hover:bg-primary-50 focus-visible:ring-offset-primary-900 focus-visible:ring-primary-50',
        destructive:
          'text-red-500 ring-1 ring-inset hover:bg-red-500 hover:text-primary-0 ring-red-500',
        // link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'px-3 text-sm py-2',
        sm: 'h-9 px-3 text-sm',
        xs: 'py-1 leading-none px-3 text-sm',
        md: 'px-4 py-2.5 text-base',
        lg: 'h-11 px-8',
        xl: 'py-4 px-14 text-base duration-200',
        square: 'h-10 text-sm w-10',
      },
      roundness: {
        default: 'rounded-full',
        lg: 'rounded-lg',
        xl: 'rounded-xl',
      },
      align: {
        default: 'justify-center',
        left: 'justify-start',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      roundness: 'default',
      align: 'default',
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant, size, roundness, align, asChild = false, ...props },
    ref,
  ) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(
          buttonVariants({ variant, size, roundness, align, className }),
        )}
        ref={ref}
        {...props}
      />
    );
  },
);

Button.displayName = 'Button';

export { Button, buttonVariants };
