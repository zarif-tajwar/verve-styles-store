import NextAuth, { type NextAuthConfig } from 'next-auth';
import GoogleProvider, { GoogleProfile } from 'next-auth/providers/google';
import FacebookProvider from 'next-auth/providers/facebook';
import EmailProvider from 'next-auth/providers/email';
import CredentialsProvider from 'next-auth/providers/credentials';
import { temporaryAdapter } from './temporaryAdapter';
import {
  UserSelect,
  accounts,
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

// export const authAdapter = DrizzleAdapter(db);
export const authAdapter = temporaryAdapter();

const getRole = (email: string): UserSelect['role'] => {
  if (email === process.env.ADMIN_EMAIL) return 'ADMIN';
  if (email === process.env.STAFF_EMAIL) return 'STAFF';
  return 'USER';
};

const authConfig = {
  session: { strategy: 'jwt' },
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
      // type: 'credentials',
      // id: 'test-credentials',
      // credentials: { password: { label: 'Password', type: 'password' } },
      authorize: async ({ password }) => {
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
    session: async ({ session, token, trigger }) => {
      if (session.user && token.sub) {
        session.user.id = token.sub;

        const cartId = (
          await db
            .select({ cartId: carts.id })
            .from(carts)
            .where(eq(carts.userId, token.sub))
        )?.at(0)?.cartId;

        session.user.cartId = cartId;
      }
      if (session.user && token.role) {
        session.user.role = token.role as UserSelect['role'];
      }
      console.log(JSON.stringify(session), 'SESSION');

      return session;
    },
    jwt: async ({ token, user }) => {
      if (!token.sub) return token;

      const dbUser = user as UserSelect;

      if (!dbUser) return token;

      token.role = dbUser.role;

      console.log(JSON.stringify(token), 'JWT');

      return token;
    },
    // authorized: async ({ auth }) => {
    //   if (auth?.user) {
    //     const isAllowed = !!(
    //       await db
    //         .select({ id: user.id })
    //         .from(user)
    //         .where(eq(user.id, auth.user.id))
    //     ).at(0);

    //     return isAllowed;
    //   }
    //   return !!auth?.user;
    // },
    // signIn: async ({ user: dbUser }) => {
    //   const isAllowed = !!(
    //     await db
    //       .select({ id: user.id })
    //       .from(user)
    //       .where(eq(user.id, dbUser.id))
    //   ).at(0);

    //   return isAllowed;
    // },
  },
  pages: {
    signIn: '/auth/sign-in',
    signOut: '/auth/sign-out',
    error: '/auth/error',
  },
  events: {
    signIn: async ({ user }) => {
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
