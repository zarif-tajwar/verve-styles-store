import { facebookOauth, lucia } from '@/auth2';
import { authCookieNames } from '@/lib/constants/auth';
import { db } from '@/lib/db';
import { oauthAccount, user } from '@/lib/db/schema/auth2';
import { getRedirectCookie } from '@/lib/server/auth';
import { and, eq } from 'drizzle-orm';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { ulid } from 'ulidx';

type FacebookUser = {
  id: string;
  name: string;
  picture: {
    data: {
      height: number;
      is_silhouette: boolean;
      url: string;
      width: number;
    };
  };
  email: string | undefined;
};

export async function GET(req: NextRequest): Promise<NextResponse> {
  const code = req.nextUrl.searchParams.get('code');
  const state = req.nextUrl.searchParams.get('state');

  const storedState = cookies().get(
    authCookieNames.OAUTH_STATE_FACEBOOK,
  )?.value;

  const postRedirectPathname = getRedirectCookie();

  if (!code || !state || !storedState || state !== storedState) {
    return NextResponse.json('Invalid OAuth state or code verifier', {
      status: 400,
    });
  }

  try {
    const tokens = await facebookOauth.validateAuthorizationCode(code);

    const url = new URL('https://graph.facebook.com/me');
    url.searchParams.set('access_token', tokens.accessToken);
    url.searchParams.set(
      'fields',
      ['id', 'name', 'picture', 'email'].join(','),
    );

    const facebookUserResponse = await fetch(url);

    const facebookUser = (await facebookUserResponse.json()) as FacebookUser;

    if (!facebookUser.email) {
      return new NextResponse(
        'No primary email address or unverified email address',
        {
          status: 400,
        },
      );
    }

    const existingUser = await db
      .select()
      .from(user)
      .where(eq(user.email, facebookUser.email))
      .then((res) => res.at(0));

    if (existingUser) {
      const existingOauthAccount = await db
        .select()
        .from(oauthAccount)
        .where(
          and(
            eq(oauthAccount.providerId, facebookUser.id),
            eq(oauthAccount.provider, 'facebook'),
          ),
        )
        .then((res) => res.at(0));

      if (!existingOauthAccount) {
        await db.transaction(async (tx) => {
          if (!facebookUser.email) {
            tx.rollback();
            return;
          }
          await tx.insert(oauthAccount).values({
            provider: 'facebook',
            providerId: facebookUser.id,
            userId: existingUser.id,
            email: facebookUser.email,
          });
        });
      }

      const session = await lucia.createSession(existingUser.id, {});
      const sessionCookie = lucia.createSessionCookie(session.id);

      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes,
      );
    } else {
      const userId = ulid();

      await db.transaction(async (tx) => {
        if (!facebookUser.email) {
          tx.rollback();
          return;
        }
        await tx.insert(user).values({
          id: userId,
          name: facebookUser.name,
          email: facebookUser.email,
          image: facebookUser.picture.data.url,
          emailVerified: true,
        });

        await tx.insert(oauthAccount).values({
          provider: 'facebook',
          providerId: facebookUser.id,
          userId,
          email: facebookUser.email,
        });
      });

      const session = await lucia.createSession(userId, {});
      const sessionCookie = lucia.createSessionCookie(session.id);

      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes,
      );
    }

    return NextResponse.redirect(
      postRedirectPathname
        ? `http://localhost:3000${postRedirectPathname}`
        : 'http://localhost:3000/auth/sign-in/',
    );
  } catch (error) {
    console.log(JSON.stringify(error));
    return NextResponse.json('Something went wrong with facebook oauth', {
      status: 500,
    });
  }
}
