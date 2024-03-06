'use server';

import { lucia } from '@/auth2';
import { and, eq, gt } from 'drizzle-orm';
import { generateId } from 'lucia';
import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { TimeSpan, createDate, isWithinExpirationDate } from 'oslo';
import { Argon2id } from 'oslo/password';
import { ulid } from 'ulidx';
import { z } from 'zod';
import { db } from '../db';
import {
  credentialsAccount,
  emailVerification,
  passwordResetToken,
  user,
} from '../db/schema/auth2';
import { sendEmail } from '../email';
import { CustomError } from '../errors/custom-error';
import { isEmailAlreadyRegistered, validateRequest } from '../server/auth';
import { genRandomInt } from '../util';
import {
  CredentialsFormSchema,
  OauthSignInActionSchema,
  SendEmailVerificationSchema,
  ValidateEmailVerificationSchema,
  getPasswordResetLinkSchema,
  passwordResetSchema,
} from '../validation/auth';
import { actionClient } from './safe-action';
import { renderAsync } from '@react-email/render';
import React from 'react';
import { ResetPassword } from '@/components/mail/ResetPassword';
import { EmailVerificaionCode } from '@/components/mail/EmailVerificationCode';

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
  async ({ email, password, confirmPassword, fullName }) => {
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

    if (!createdData) {
      throw new Error('Something went wrong!');
    }

    const firstName = fullName.split(' ').at(0)!;

    const html = await renderAsync(
      React.createElement(EmailVerificaionCode, {
        firstName,
        code: createdData.code,
      }),
    );

    await sendEmail({
      emailOptions: {
        to: email,
        subject: `Verification Code - Verve Styles`,
        html,
      },
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

export const getPasswordResetLinkAction = actionClient(
  getPasswordResetLinkSchema,
  async ({ email }) => {
    const existingUser = await db
      .select()
      .from(user)
      .where(eq(user.email, email))
      .then((res) => res.at(0));

    if (!existingUser) {
      throw new CustomError('There is no account registered with this email.');
    }

    const tokenId = generateId(40);

    const createdTokenData = await db.transaction(async (tx) => {
      return await tx
        .insert(passwordResetToken)
        .values({
          id: tokenId,
          userId: existingUser.id,
          expiresAt: createDate(new TimeSpan(10, 'h')),
        })
        .returning()
        .then((res) => res.at(0));
    });

    if (!createdTokenData) {
      throw new CustomError('Something went wrong!');
    }

    const origin = headers().get('origin');

    if (!origin) {
      throw new CustomError('Something went wrong!');
    }

    const resetLinkUrl = `${origin}/auth/reset-password/${createdTokenData.id}`;

    const firstName = existingUser.name.split(' ').at(0)!;

    const html = await renderAsync(
      React.createElement(ResetPassword, {
        firstName,
        resetLink: resetLinkUrl,
      }),
    );

    await sendEmail({
      emailOptions: {
        to: email,
        subject: `Reset Password - Verve Styles`,
        html,
      },
    });

    return { success: true };
  },
);

export const passwordResetAction = actionClient(
  passwordResetSchema,
  async (values) => {
    const referer = headers().get('referer');

    if (!referer) {
      throw new CustomError('Something went wrong!');
    }

    const url = new URL(referer);

    const resetTokenId = url.pathname.slice(url.pathname.lastIndexOf('/') + 1);

    const resetTokenData = await db
      .select()
      .from(passwordResetToken)
      .where(eq(passwordResetToken.id, resetTokenId))
      .then((res) => res.at(0));

    if (!resetTokenData) {
      throw new CustomError('Invalid reset token');
    }

    if (!isWithinExpirationDate(resetTokenData.expiresAt)) {
      throw new CustomError(
        'Your password reset token has been expired. Please go through the reset process again.',
      );
    }

    const existingCredentialAccount = await db
      .select()
      .from(credentialsAccount)
      .where(eq(credentialsAccount.userId, resetTokenData.userId))
      .then((res) => res.at(0));

    await lucia.invalidateUserSessions(resetTokenData.userId);

    const hashedPassword = await new Argon2id().hash(values.password);

    if (existingCredentialAccount) {
      await db.transaction(async (tx) => {
        await tx
          .update(credentialsAccount)
          .set({ hashedPassword, updatedAt: new Date() })
          .where(eq(credentialsAccount.userId, resetTokenData.userId));
      });
    } else {
      await db.transaction(async (tx) => {
        await tx
          .insert(credentialsAccount)
          .values({ userId: resetTokenData.userId, hashedPassword });
      });
    }

    await db.transaction(async (tx) => {
      await tx
        .delete(passwordResetToken)
        .where(eq(passwordResetToken.userId, resetTokenData.userId));
    });

    return { success: true };
  },
);
