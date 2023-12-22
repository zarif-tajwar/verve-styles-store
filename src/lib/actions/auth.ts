'use server';

import 'server-only';
import { signIn, signOut } from '@/auth';
import { cookies } from 'next/headers';

export { signIn as signInAction };
export { signOut as signOutAction };
