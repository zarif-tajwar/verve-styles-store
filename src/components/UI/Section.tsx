import { cn } from '@/lib/util';
import React from 'react';
import { Slot } from '@radix-ui/react-slot';

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  asChild?: boolean;
  fullScreen?: boolean;
  noVerticalPadding?: boolean;
}

export const Section = React.forwardRef<HTMLElement, SectionProps>(
  (
    { className, asChild = false, fullScreen, noVerticalPadding, ...props },
    ref,
  ) => {
    const Comp = asChild ? Slot : 'section';
    return (
      <Comp
        className={cn(
          'py-12 md:py-16 lg:py-20',
          fullScreen &&
            'landscape:md:max-h-[calc(60rem-var(--nav-height))] landscape:md:[@media(height>=900px)]:h-[calc(100dvh-var(--nav-height))]',
          noVerticalPadding && 'py-0 md:py-0 lg:py-0',
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);

Section.displayName = 'Section';
