import { facebookOauth } from '@/auth2';
import { authCookieNames } from '@/lib/constants/auth';
import { setRedirectCookie } from '@/lib/server/auth';
import { generateState } from 'arctic';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest): Promise<NextResponse> {
  const state = generateState();

  const oauthUrl = await facebookOauth.createAuthorizationURL(state, {
    scopes: ['email', 'public_profile'],
  });

  (await cookies()).set(authCookieNames.OAUTH_STATE_FACEBOOK, state, {
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 60 * 10,
    sameSite: 'lax',
  });

  setRedirectCookie(req.nextUrl.searchParams);

  return NextResponse.redirect(oauthUrl);
}
