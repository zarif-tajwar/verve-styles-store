'use client';
import { Button } from '@/components/UI/Button';
import {
  errorToast,
  messageToast,
  successToast,
  warningToast,
} from '@/components/UI/Toaster';
import { useCountDown } from '@/lib/hooks/useCountdown';
import { wait } from '@/lib/util';
import { randLines } from '@ngneat/falso';
import { useEffect } from 'react';

const ToastBtn = () => {
  return (
    <Button
      onClick={async () => {
        // successToast('Success', { description: 'Address was created' });
        // await wait(1000);
        // errorToast('Failed', {
        //   description: 'Something went wrong while creating the address',
        // });
        // await wait(1000);
        // messageToast('Event was successful!');
        // await wait(1000);
        errorToast('Stock quantity mismatch', {
          description: randLines({ length: 10 }).join(''),
        });
      }}
    >
      Open Toast
    </Button>
  );
};
export default ToastBtn;
