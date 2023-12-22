import { cn } from '@/lib/util';
import React from 'react';

interface DividerProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  horizontal?: boolean;
}

const Divider = React.forwardRef<HTMLDivElement, DividerProps>(
  ({ className, horizontal, ...props }, ref) => {
    return (
      <div
        role="separator"
        className={cn(
          'bg-primary-100',
          !horizontal && 'h-px min-w-max',
          horizontal && 'min-h-max w-px',
          className,
        )}
        {...props}
        ref={ref}
        aria-orientation={horizontal ? 'horizontal' : 'vertical'}
      />
    );
  },
);

Divider.displayName = 'Divider';

export default Divider;
