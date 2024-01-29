import NextAuth, { DefaultSession, Account as DefaultAccount } from 'next-auth';
import { UserSelect } from '../db/schema/auth';
import { CartsSelect } from '../db/schema/carts';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      role: UserSelect['role'];
      cartId?: CartsSelect['id'];
    } & DefaultSession['user'];
  }

  interface User {}
}
