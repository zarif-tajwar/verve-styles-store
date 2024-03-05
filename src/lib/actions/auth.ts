'use server';

import { and, eq, lt, gt } from 'drizzle-orm';
import { db } from '../db';
import {
  credentialsAccount,
  emailVerification,
  user,
} from '../db/schema/auth2';
import { CustomError } from '../errors/custom-error';
import {
  CredentialsFormSchema,
  CredentialsFormSchemaType,
  OauthSignInActionSchema,
  SendEmailVerificationSchema,
  SignUpCredentialsFormSchema,
  SignUpCredentialsFormStepSchemas,
  ValidateEmailVerificationSchema,
} from '../validation/auth';
import { actionClient } from './safe-action';
import { Argon2id } from 'oslo/password';
import { lucia } from '@/auth2';
import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { isEmailAlreadyRegistered, validateRequest } from '../server/auth';
import { z } from 'zod';
import { ulid } from 'ulidx';
import { genRandomInt } from '../util';
import { TimeSpan, createDate, isWithinExpirationDate } from 'oslo';

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

export const isEmailAlreadyRegisteredAction = actionClient(
  z.object({ email: z.string().email() }),
  async ({ email }) => {
    const isRegistered = await isEmailAlreadyRegistered(email);
    if (isRegistered)
      throw new CustomError('This email is already registered!');

    return false;
  },
);

export const sendEmailVerificationAction = actionClient(
  SendEmailVerificationSchema,
  async ({ email, password, confirmPassword }) => {
    const isRegistered = await isEmailAlreadyRegistered(email);

    if (isRegistered)
      throw new CustomError('This email is already registered!');

    if (password !== confirmPassword) {
      throw new CustomError(`Passwords don't match!`);
    }

    const verificationCode = genRandomInt(100000, 999999);
    const expiresAt = createDate(new TimeSpan(5, 'm'));
    const ip = headers().get('x-forwarded-for')?.split(',').at(0);

    if (!ip) {
      throw new CustomError('Something went wrong with your network!');
    }

    const isVerificationCodeAlreadySent = await db
      .select()
      .from(emailVerification)
      .where(
        and(
          eq(emailVerification.email, email),
          gt(emailVerification.expiresAt, new Date()),
          eq(emailVerification.ip, ip),
        ),
      )
      .then((res) => res.at(0));

    if (isVerificationCodeAlreadySent) {
      return { success: true, message: 'Verification code was already sent!' };
    }

    const createdData = await db.transaction(async (tx) => {
      return await tx
        .insert(emailVerification)
        .values({ id: ulid(), code: verificationCode, expiresAt, ip, email })
        .returning()
        .then((res) => res.at(0));
    });

    return { success: true };
  },
);

export const validateEmailVerificationAction = actionClient(
  ValidateEmailVerificationSchema,
  async (values) => {
    if (values.password !== values.confirmPassword) {
      throw new CustomError(
        `Your input password and confirmation password did not match!`,
      );
    }

    const isRegistered = await isEmailAlreadyRegistered(values.email);
    if (isRegistered)
      throw new CustomError('This email is already registered!');

    const ip = headers().get('x-forwarded-for')?.split(',').at(0);

    if (!ip) {
      throw new CustomError('Something went wrong with your network!');
    }

    const verificationResult = await db
      .select()
      .from(emailVerification)
      .where(
        and(
          eq(emailVerification.code, values.code),
          eq(emailVerification.email, values.email),
        ),
      )
      .then((res) => res.at(0));

    if (!verificationResult) {
      throw new CustomError('Incorrect verification code!');
    }

    if (!isWithinExpirationDate(verificationResult.expiresAt)) {
      throw new CustomError('This verification code has been expired!');
    }

    if (verificationResult.ip !== ip) {
      throw new CustomError('Please try again with the same network!');
    }

    const userId = ulid();
    const hashedPassword = await new Argon2id().hash(values.password);

    await db.transaction(async (tx) => {
      await tx
        .delete(emailVerification)
        .where(
          and(
            eq(emailVerification.code, values.code),
            eq(emailVerification.email, values.email),
          ),
        );
      await tx.insert(user).values({
        id: userId,
        name: values.fullName,
        email: values.email,
        emailVerified: true,
      });
      await tx.insert(credentialsAccount).values({
        userId,
        hashedPassword,
      });
    });

    const session = await lucia.createSession(userId, {});
    const sessionCookie = lucia.createSessionCookie(session.id);

    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes,
    );
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
