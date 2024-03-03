'use server';

import { eq } from 'drizzle-orm';
import { db } from '../db';
import { credentialsAccount, user } from '../db/schema/auth2';
import { CustomError } from '../errors/custom-error';
import {
  CredentialsFormSchema,
  CredentialsFormSchemaType,
  OauthSignInActionSchema,
  SignUpCredentialsFormSchema,
} from '../validation/auth';
import { actionClient } from './safe-action';
import { Argon2id } from 'oslo/password';
import { lucia } from '@/auth2';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { validateRequest } from '../server/auth';
import { z } from 'zod';
import { ulid } from 'ulidx';

// import { signIn, signOut } from '@/auth';
// import 'server-only';
// import { z } from 'zod';

// export { signIn as signInAction, signOut as signOutAction };

// const SimulateSignInActionSchema = z.object({});

// export const simulateSignInAction = async () => {
//   await signIn('credentials', { redirectTo: '/shop', redirect: true }, {});
// };

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

export const signInCredentialsAction = actionClient(
  CredentialsFormSchema,
  async (values) => {
    const userData = await db
      .select({
        userId: user.id,
        email: user.email,
        password: credentialsAccount.hashedPassword,
      })
      .from(user)
      .innerJoin(credentialsAccount, eq(user.id, credentialsAccount.userId))
      .where(eq(user.email, values.email))
      .then((res) => res[0]);

    if (!userData) {
      throw new CustomError('Incorrect email or password!');
    }

    // const isPasswordValid = true;
    const isPasswordValid = await new Argon2id().verify(
      userData.password,
      values.password,
    );

    if (!isPasswordValid) {
      throw new CustomError('Incorrect email or password!');
    }

    const session = await lucia.createSession(userData.userId, {});
    const sessionCookie = lucia.createSessionCookie(session.id);

    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes,
    );

    redirect('/');
  },
);
export const signUpCredentialsAction = actionClient(
  SignUpCredentialsFormSchema,
  async (values) => {
    const existingUser = await db
      .select()
      .from(user)
      .where(eq(user.email, values.email))
      .then((res) => res[0]);

    if (existingUser) {
      throw new CustomError('This email is already registered!');
    }

    const userId = ulid();
    const hashedPassword = await new Argon2id().hash(values.password);

    const createdUser = await db.transaction(async (tx) => {
      const createdUser = await tx
        .insert(user)
        .values({ id: userId, email: values.email, name: values.fullName })
        .returning()
        .then((res) => res.at(0));

      await tx.insert(credentialsAccount).values({ userId, hashedPassword });

      return createdUser;
    });

    if (!createdUser) {
      throw new CustomError('Something went wrong while creating the account!');
    }

    const session = await lucia.createSession(createdUser.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);

    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes,
    );

    return { success: true };
  },
);
// export const signInCredentialsAction = async (
//   values: CredentialsFormSchemaType,
// ) => {};

export const signOutAction = actionClient(z.object({}), async () => {
  const { session } = await validateRequest();
  if (!session) {
    throw new CustomError(`You're already logged out!`);
  }

  await lucia.invalidateSession(session.id);

  const sessionCookie = lucia.createBlankSessionCookie();
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  );

  redirect('/auth/sign-in');
});

export const oauthSignInAction = actionClient(
  OauthSignInActionSchema,
  async ({ provider, redirectAfterPathname }) => {
    const searchParams = new URLSearchParams();

    if (redirectAfterPathname) {
      searchParams.set('redirectAfter', redirectAfterPathname);
    }

    redirect(
      `/api/auth/sign-in/${provider}${searchParams.size > 0 ? `?${searchParams.toString()}` : ''}`,
    );
  },
);
