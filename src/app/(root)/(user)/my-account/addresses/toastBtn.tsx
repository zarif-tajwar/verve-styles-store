'use client';
import { Button } from '@/components/UI/Button';
import {
  errorToast,
  messageToast,
  successToast,
  warningToast,
} from '@/components/UI/Toaster';
import { wait } from '@/lib/util';

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
        warningToast('Warning', {
          description: "Make sure you're deleting the right item",
        });
      }}
    >
      Open Toast
    </Button>
  );
};
export default ToastBtn;
