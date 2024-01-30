'use server';

import 'server-only';
import { signIn, signOut } from '@/auth';
import { cookies } from 'next/headers';
import { actionClient } from './safe-action';
import { z } from 'zod';
import { CustomError } from '../errors/custom-error';

export { signIn as signInAction };
export { signOut as signOutAction };

const SimulateSignInActionSchema = z.object({});

export const simulateSignInAction = async () => {
  await signIn('credentials', { redirectTo: '/shop', redirect: true }, {});
};

// export const simulateSignInAction = actionClient(
//   SimulateSignInActionSchema,
//   async () => {
//     try {
//       await signIn('credentials', { redirectTo: '/shop', redirect: true }, {});
//     } catch (error) {
//       throw new CustomError(error.message);
//     }
//   },
// );
