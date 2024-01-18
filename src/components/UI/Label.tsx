import * as React from 'react';

import { cn } from '@/lib/util';

export interface LabelProps
  extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
}

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, children, required, ...props }, ref) => {
    return (
      <label
        className={cn('inline-flex w-max items-center gap-1', className)}
        ref={ref}
        {...props}
      >
        {children}
        {required === false && (
          <span className="text-xs font-medium text-primary-400">
            (optional)
          </span>
        )}
      </label>
    );
  },
);
Label.displayName = 'Label';

export { Label };
