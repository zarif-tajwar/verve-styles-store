import NextAuth, { DefaultSession, Account as DefaultAccount } from 'next-auth';
import { UserSelect } from '../db/schema/auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      role: UserSelect['role'];
    } & DefaultSession['user'];
  }

  interface User {}
}
