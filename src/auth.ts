import NextAuth, { type NextAuthConfig } from 'next-auth';
import GoogleProvider, { GoogleProfile } from 'next-auth/providers/google';
import FacebookProvider from 'next-auth/providers/facebook';
import { temporaryAdapter } from './temporaryAdapter';
import { UserSelect, accounts } from '@/lib/db/schema/auth';
import 'dotenv/config';
import { wait } from './lib/util';
import { db } from './lib/db';
import { eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

// export const authAdapter = DrizzleAdapter(db);
export const authAdapter = temporaryAdapter();

const getRole = (email: string): UserSelect['role'] => {
  if (email === process.env.ADMIN_EMAIL) return 'ADMIN';
  if (email === process.env.STAFF_EMAIL) return 'STAFF';
  return 'USER';
};

const authConfig = {
  providers: [
    GoogleProvider({
      profile: (profile: GoogleProfile) => {
        return {
          id: profile.sub,
          name: profile.name,
          image: profile.picture,
          email: profile.email,
          role: getRole(profile.email),
        };
      },
    }),
    FacebookProvider({
      profile: (profile) => {
        return {
          id: profile.id,
          name: profile.name,
          image: profile.picture.data.url,
          email: profile.email,
          role: getRole(profile.email),
        };
      },
    }),
  ],
  adapter: authAdapter,
  callbacks: {
    session: async ({ session, user }) => {
      const dbUser = user as UserSelect;
      session.user.id = user.id;
      session.user.role = dbUser.role;
      return session;
    },
  },
  pages: {
    signIn: '/auth/sign-in',
    signOut: '/auth/sign-out',
    error: '/auth/error',
  },
  events: {
    linkAccount: async ({ profile, account }) => {
      // inserts email and name into provider account.
      // these extra database calls wouldn't be necessary if auth js supported custom logic
      // or provided the oauth profile object while creating an account
      db.transaction(async (tx) => {
        const extraInfo = (
          await tx
            .select({
              name: accounts.name,
              email: accounts.email,
            })
            .from(accounts)
            .where(eq(accounts.providerAccountId, account.providerAccountId))
        )[0];

        if (extraInfo && extraInfo.email && extraInfo.name) {
          await tx.rollback();
          return;
        }

        await tx
          .update(accounts)
          .set({
            email: profile.email,
            name: profile.name,
          })
          .where(eq(accounts.providerAccountId, account.providerAccountId));
      });
    },
  },
  trustHost: true,
} satisfies NextAuthConfig;

export const { auth, handlers, signOut, signIn, update } = NextAuth(authConfig);
