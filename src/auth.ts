import NextAuth, { type NextAuthConfig } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { DrizzleAdapter } from '@auth/drizzle-adapter';
import { db } from './lib/db';

const authConfig = {
  providers: [GoogleProvider({})],
  adapter: DrizzleAdapter(db),
  callbacks: {
    session: async ({ session, user }) => {
      session.user.id = user.id;
      return session;
    },
  },
  pages: {
    signIn: '/sign-in',
  },
} satisfies NextAuthConfig;

export const { auth, handlers, signOut, signIn } = NextAuth(authConfig);
