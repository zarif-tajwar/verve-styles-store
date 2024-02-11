import { capitalize, cn } from '@/lib/util';
import React from 'react';

export const formatSizeText = (sizeText: string) =>
  sizeText.length > 3 ? capitalize(sizeText) : sizeText.toUpperCase();

export interface SizeBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  sizeText: string;
}

const SizeBadge = React.forwardRef<HTMLSpanElement, SizeBadgeProps>(
  ({ className, sizeText, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          'mb-2 inline-flex min-w-[3rem] items-center justify-center rounded-full px-2 py-0.5 text-xs font-normal tracking-wide ring-1  ring-inset ring-primary-100',
          className,
        )}
        {...props}
      >
        {formatSizeText(sizeText)}
      </span>
    );
  },
);

SizeBadge.displayName = 'SizeBadge';

export default SizeBadge;
