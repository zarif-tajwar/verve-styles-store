'use server';

import { signIn } from '@/auth';

export const signInAction = async () => {
  await signIn('google', {
    redirectTo: '/shop',
  });
};
