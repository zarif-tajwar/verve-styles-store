import * as React from 'react';

import { cn } from '@/lib/util';
import * as LabelPrimitive from '@radix-ui/react-label';

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> & {
    required?: boolean;
  }
>(({ className, children, required, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(
      'inline-flex w-max items-center gap-1 font-medium leading-none text-primary-400 peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
      className,
    )}
    {...props}
  >
    {children}
    {required === false && (
      <span className="text-xs font-medium text-primary-400">(optional)</span>
    )}
  </LabelPrimitive.Root>
));
Label.displayName = LabelPrimitive.Root.displayName;

export { Label };
