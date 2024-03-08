import { lucia } from '@/auth2';
import { db } from '@/lib/db';
import { eq } from 'drizzle-orm';
import type { Session, User } from 'lucia';
import { cookies } from 'next/headers';
import { isWithinExpirationDate } from 'oslo';
import { cache } from 'react';
import 'server-only';
import { authCookieNames } from '../constants/auth';
import { passwordResetToken, user } from '../db/schema/auth2';
import { UserObjectClient } from '../types/auth';

export const auth = cache(
  async (): Promise<
    { user: User; session: Session } | { user: null; session: null }
  > => {
    const sessionId = cookies().get(lucia.sessionCookieName)?.value ?? null;

    if (!sessionId) {
      return {
        user: null,
        session: null,
      };
    }

    const result = await lucia.validateSession(sessionId);
    // next.js throws when you attempt to set cookie when rendering page
    try {
      if (result.session && result.session.fresh) {
        const sessionCookie = lucia.createSessionCookie(result.session.id);
        cookies().set(
          sessionCookie.name,
          sessionCookie.value,
          sessionCookie.attributes,
        );
      }
      if (!result.session) {
        const sessionCookie = lucia.createBlankSessionCookie();
        cookies().set(
          sessionCookie.name,
          sessionCookie.value,
          sessionCookie.attributes,
        );
      }
    } catch {}
    return result;
  },
);

export const getUserObjectClient = (
  user: User | null,
): UserObjectClient | null => {
  if (!user) return null;

  return { name: user.name, image: user.image, email: user.email };
};

export const setRedirectCookie = (searchParams: URLSearchParams) => {
  const redirectAfterPathname = searchParams.get('redirectAfter') ?? '';

  if (redirectAfterPathname) {
    cookies().set(authCookieNames.AFTER_REDIRECT_LINK, redirectAfterPathname, {
      path: '/',
      secure: false,
      httpOnly: true,
      maxAge: 60 * 10,
      sameSite: 'lax',
    });
  }
};

export const getRedirectCookie = () => {
  const redirectAfterPathnameEncoded = cookies().get(
    authCookieNames.AFTER_REDIRECT_LINK,
  )?.value;

  const redirectAfterPathname = redirectAfterPathnameEncoded
    ? decodeURIComponent(redirectAfterPathnameEncoded)
    : null;

  if (redirectAfterPathname) {
    cookies().delete(authCookieNames.AFTER_REDIRECT_LINK);
  }

  return redirectAfterPathname;
};

export const getUserByEmail = async (email: string) => {
  return await db
    .select()
    .from(user)
    .where(eq(user.email, email))
    .then((res) => res[0]);
};

export const getPasswordResetTokenInfo = async ({
  tokenId,
}: {
  tokenId: string;
}) => {
  const data = await db
    .select()
    .from(passwordResetToken)
    .innerJoin(user, eq(passwordResetToken.userId, user.id))
    .where(eq(passwordResetToken.id, tokenId))
    .then((res) => res.at(0));

  if (!data) {
    return;
  }

  if (!isWithinExpirationDate(data.password_reset_token.expiresAt)) {
    return { expired: true };
  }

  return { name: data.user.name, email: data.user.email };
};
