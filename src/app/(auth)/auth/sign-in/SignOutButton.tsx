'use client';

import { Button } from '@/components/UI/Button';
import { errorToast } from '@/components/UI/Toaster';
import { signOutAction } from '@/lib/actions/auth';
import { useAction } from 'next-safe-action/hooks';

const SignOutButton = () => {
  const { execute } = useAction(signOutAction, {
    onError: ({ error: { serverError } }) => {
      if (serverError) {
        errorToast(serverError);
      }
    },
  });
  return (
    <Button
      onClick={() => {
        execute();
      }}
    >
      Sign Out
    </Button>
  );
};
export default SignOutButton;
