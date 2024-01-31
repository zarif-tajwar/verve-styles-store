import NextAuth, { type NextAuthConfig } from 'next-auth';
import GoogleProvider, { GoogleProfile } from 'next-auth/providers/google';
import FacebookProvider from 'next-auth/providers/facebook';
import EmailProvider from 'next-auth/providers/email';
import CredentialsProvider from 'next-auth/providers/credentials';
import { temporaryAdapter } from './temporaryAdapter';
import {
  UserSelect,
  accounts,
  sessions,
  user,
  user as userTable,
} from '@/lib/db/schema/auth';
import 'dotenv/config';
import { genRandomInt, parseIntWithUndefined, wait } from './lib/util';
import { db } from './lib/db';
import { and, eq, isNull } from 'drizzle-orm';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { DrizzleAdapter } from '@auth/drizzle-adapter';
import { carts } from './lib/db/schema/carts';
import { handleCartOnSignIn } from './lib/server/cart';
import { randomUUID } from 'crypto';
import { SESSION_MAX_AGE } from './lib/constants/auth';
import { cache } from 'react';
import { encodeSingleSqid } from './lib/server/sqids';

// export const authAdapter = DrizzleAdapter(db);
export const authAdapter = temporaryAdapter();

const getRole = (email: string): UserSelect['role'] => {
  if (email === process.env.ADMIN_EMAIL) return 'ADMIN';
  if (email === process.env.STAFF_EMAIL) return 'STAFF';
  return 'USER';
};

const authConfig = {
  session: { maxAge: SESSION_MAX_AGE, strategy: 'database' },
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
    // EmailProvider({
    //   server: {
    //     host: process.env.SENDGRID_HOST,
    //     port: process.env.SENDGRID_PORT,
    //     auth: {
    //       user: process.env.SENDGRID_USER,
    //       pass: process.env.SENDGRID_API_KEY,
    //     },
    //   },
    //   from: process.env.SENDGRID_EMAIL_FROM,
    // }),
    CredentialsProvider({
      authorize: async ({}) => {
        const allTestUsers = await db
          .select()
          .from(user)
          .where(eq(user.role, 'TEST USER'));
        if (allTestUsers.length === 0) return null;
        const randomlySelectedUser = allTestUsers.at(
          genRandomInt(0, allTestUsers.length - 1),
        );
        if (!randomlySelectedUser) return null;
        return {
          id: randomlySelectedUser.id,
          name: randomlySelectedUser.image,
          email: randomlySelectedUser.email,
          image: randomlySelectedUser.image,
          role: randomlySelectedUser.role,
        };
      },
    }),
  ],
  adapter: authAdapter,
  callbacks: {
    jwt: async ({ token }) => {
      if (!token.sub) return token;

      const createdSession = (
        await db
          .insert(sessions)
          .values({
            expires: new Date(Date.now() + SESSION_MAX_AGE * 1000),
            sessionToken: randomUUID(),
            userId: token.sub,
          })
          .returning()
      ).at(0);

      if (!createdSession) return token;

      return { ...token, id: createdSession.sessionToken };
    },
    session: async ({ session, user }) => {
      const dbUser = user as UserSelect;
      session.user.id = user.id;
      session.user.role = dbUser.role;

      const cartId = (
        await db
          .select({ cartId: carts.id })
          .from(carts)
          .where(eq(carts.userId, user.id))
      )?.at(0)?.cartId;

      session.user.cartId = cartId ? encodeSingleSqid(cartId) : undefined;

      return session;
    },
  },
  jwt: {
    encode: ({ token }) => {
      return token?.id as unknown as string;
    },
    decode: () => {
      return null;
    },
  },

  pages: {
    signIn: '/auth/sign-in',
    signOut: '/auth/sign-out',
    error: '/auth/error',
  },

  events: {
    signIn: async ({ user }) => {
      console.log('SIGN IN HAPPENED');
      await handleCartOnSignIn(user);
    },
    linkAccount: async ({ profile, account }) => {
      // inserts email and name into provider account.
      // these extra database calls wouldn't be necessary if auth js supported custom logic
      // or provided the oauth profile object while creating an account
      db.transaction(async (tx) => {
        await tx
          .update(accounts)
          .set({
            email: profile.email,
            name: profile.name,
          })
          .where(
            and(
              eq(accounts.providerAccountId, account.providerAccountId),
              isNull(accounts.name),
              isNull(accounts.email),
            ),
          );
      });
    },
  },
  trustHost: true,
} satisfies NextAuthConfig;

export const { auth, handlers, signOut, signIn, update } = NextAuth(authConfig);

export const dedupedAuth = cache(auth);
