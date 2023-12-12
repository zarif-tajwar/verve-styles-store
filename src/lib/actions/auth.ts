'use server';

import { signIn, signOut } from '@/auth';

export const signInAction = async (
  ...signInProps: Parameters<typeof signIn>
) => {
  await signIn(...signInProps);
};

export const signOutAction = async () => {
  await signOut({ redirectTo: '/shop' });
};
