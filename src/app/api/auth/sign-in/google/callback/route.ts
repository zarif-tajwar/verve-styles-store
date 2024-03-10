import { googleOauth, lucia } from '@/auth2';
import { authCookieNames } from '@/lib/constants/auth';
import { db } from '@/lib/db';
import { oauthAccount, user } from '@/lib/db/schema/auth2';
import { getRedirectCookie } from '@/lib/server/auth';
import { handleCartOnSignIn } from '@/lib/server/cart';
import { and, eq } from 'drizzle-orm';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { NextRequest, NextResponse } from 'next/server';
import { ulid } from 'ulidx';

type GoogleUser = {
  sub: string;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  email: string;
  email_verified: boolean;
  locale: string;
};

export async function GET(req: NextRequest): Promise<NextResponse> {
  const code = req.nextUrl.searchParams.get('code');
  const state = req.nextUrl.searchParams.get('state');

  const storedState = cookies().get(authCookieNames.OAUTH_STATE_GOOGLE)?.value;
  const storedCodeVerifier = cookies().get(
    authCookieNames.OAUTH_CODE_VERIFIER_GOOGLE,
  )?.value;

  const postRedirectPathname = getRedirectCookie();

  if (
    !code ||
    !state ||
    !storedState ||
    !storedCodeVerifier ||
    state !== storedState
  ) {
    return NextResponse.json('Invalid OAuth state or code verifier', {
      status: 400,
    });
  }

  try {
    const tokens = await googleOauth.validateAuthorizationCode(
      code,
      storedCodeVerifier,
    );

    const googleUserResponse = await fetch(
      'https://openidconnect.googleapis.com/v1/userinfo',
      {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`,
        },
      },
    );

    const googleUser = (await googleUserResponse.json()) as GoogleUser;

    if (!googleUser.email) {
      return new NextResponse('No primary email address', {
        status: 400,
      });
    }

    if (!googleUser.email_verified) {
      return new NextResponse('Unverified email', {
        status: 400,
      });
    }

    const existingUser = await db
      .select()
      .from(user)
      .where(eq(user.email, googleUser.email))
      .then((res) => res.at(0));

    if (existingUser) {
      const existingOauthAccount = await db
        .select()
        .from(oauthAccount)
        .where(
          and(
            eq(oauthAccount.providerId, googleUser.sub),
            eq(oauthAccount.provider, 'google'),
          ),
        )
        .then((res) => res.at(0));

      if (!existingOauthAccount) {
        await db.transaction(async (tx) => {
          await tx.insert(oauthAccount).values({
            provider: 'google',
            providerId: googleUser.sub,
            userId: existingUser.id,
            email: googleUser.email,
          });
        });
      }

      const [_, session] = await Promise.all([
        handleCartOnSignIn(existingUser.id),
        lucia.createSession(existingUser.id, {}),
      ]);
      const sessionCookie = lucia.createSessionCookie(session.id);

      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes,
      );
    } else {
      const userId = ulid();

      await db.transaction(async (tx) => {
        await tx.insert(user).values({
          id: userId,
          name: googleUser.name,
          email: googleUser.email,
          image: googleUser.picture,
          emailVerified: true,
        });

        await tx.insert(oauthAccount).values({
          provider: 'google',
          providerId: googleUser.sub,
          userId,
          email: googleUser.email,
        });
      });

      const [_, session] = await Promise.all([
        handleCartOnSignIn(userId),
        lucia.createSession(userId, {}),
      ]);
      const sessionCookie = lucia.createSessionCookie(session.id);

      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes,
      );
    }
  } catch (error) {
    console.log(JSON.stringify(error));
  }
  redirect(postRedirectPathname ? postRedirectPathname : '/shop');
}
