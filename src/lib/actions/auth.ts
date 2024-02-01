'use server';

import { signIn, signOut } from '@/auth';
import 'server-only';
import { z } from 'zod';

export { signIn as signInAction, signOut as signOutAction };

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
