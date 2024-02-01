'use client';

import { XMarkIcon as XMarkIcon16 } from '@heroicons/react/16/solid';
import { XMarkIcon as XMarkIcon20 } from '@heroicons/react/20/solid';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import * as React from 'react';

import { cn } from '@/lib/util';

const Dialog = DialogPrimitive.Root;

const DialogTrigger = DialogPrimitive.Trigger;

const DialogPortal = DialogPrimitive.Portal;

// const DialogClose = DialogPrimitive.Close;

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-white/70 backdrop-blur-sm',
      className,
    )}
    {...props}
  />
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & {
    removeDefaultCloseBtn?: boolean;
  }
>(({ className, children, removeDefaultCloseBtn, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-primary-0 p-6 shadow-lg duration-200 sm:rounded-xl',
        className,
      )}
      {...props}
    >
      <div className="relative">
        {children}
        {!removeDefaultCloseBtn && <DialogCloseBtn />}
      </div>
    </DialogPrimitive.Content>
  </DialogPortal>
));
DialogContent.displayName = DialogPrimitive.Content.displayName;

const DialogCloseBtn = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Close>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Close>
>(({ className, children, ...props }, ref) => (
  <DialogPrimitive.Close
    ref={ref}
    {...props}
    className={cn(
      'absolute -top-2 right-0 flex size-7 -translate-y-1.5 translate-x-1.5 items-center justify-center rounded-full transition-opacity hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-primary-300 disabled:pointer-events-none',
      className,
    )}
  >
    {children ? (
      children
    ) : (
      <>
        <XMarkIcon16 className="size-4 sm:hidden" />
        <XMarkIcon20 className="hidden size-5 sm:block" />
        <span className="sr-only">Close</span>
      </>
    )}
  </DialogPrimitive.Close>
));

DialogCloseBtn.displayName = 'DialogCloseBtn';

export {
  Dialog,
  DialogCloseBtn,
  DialogContent,
  DialogOverlay,
  DialogPortal,
  DialogTrigger,
};
