'use client';

'use client';

import React from 'react';
import { Toaster as Sonner, toast } from 'sonner';

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      className="toaster group !font-geist"
      toastOptions={{
        classNames: {
          toast:
            'group toast flex group-[.toaster]:bg-primary-0 group-[.toaster]:text-primary-500 group-[.toaster]:border-primary-50',
          description: 'group-[.toast]:text-primary-300 !font-medium',
          actionButton:
            'group-[.toast]:bg-primary-0 group-[.toast]:text-primary-500',
          cancelButton:
            'group-[.toast]:bg-primary-300 group-[.toast]:text-primary-0',
          title: '!font-medium',
        },
      }}
      {...props}
    />
  );
};

export const errorToast: typeof toast.error = (message, data) =>
  toast.error(message, {
    ...data,
    classNames: {
      description: '!text-rose-900 ',
      toast: '!text-rose-500',
    },
  });

export const successToast: typeof toast.success = (message, data) =>
  toast.success(message, {
    ...data,
    classNames: {
      toast: '!text-emerald-600',
      description: '!text-emerald-900 ',
    },
  });

export const warningToast: typeof toast.warning = (message, data) =>
  toast.warning(message, {
    ...data,
    classNames: {
      toast: '!text-yellow-600',
      description: '!text-yellow-900 ',
    },
  });

export const messageToast: typeof toast.message = (message, data) =>
  toast.message(message, { ...data });

export { Toaster };
