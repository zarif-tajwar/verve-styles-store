'use server';

import 'server-only';
import { signIn, signOut } from '@/auth';

export { signIn as signInAction };
export { signOut as signOutAction };
