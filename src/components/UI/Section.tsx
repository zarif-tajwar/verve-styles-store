import { cn } from '@/lib/util';
import React from 'react';
import { Slot } from '@radix-ui/react-slot';

export interface FullScreenSectionProps
  extends React.HTMLAttributes<HTMLElement> {
  asChild?: boolean;
}

export const FullScreenSection = React.forwardRef<
  HTMLElement,
  FullScreenSectionProps
>(({ className, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : 'section';
  return (
    <Comp
      className={cn(
        'landscape:md:max-h-[calc(60rem-var(--nav-height))] landscape:md:[@media(height>=900px)]:h-[calc(100dvh-var(--nav-height))]',
        className,
      )}
      ref={ref}
      {...props}
    />
  );
});

FullScreenSection.displayName = 'FullScreenSection';
