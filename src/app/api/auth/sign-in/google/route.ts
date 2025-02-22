import { googleOauth } from '@/auth2';
import { authCookieNames } from '@/lib/constants/auth';
import { setRedirectCookie } from '@/lib/server/auth';
import { generateCodeVerifier, generateState } from 'arctic';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest): Promise<NextResponse> {
  const cookiesStore = await cookies();

  const state = generateState();
  const codeVerifier = generateCodeVerifier();

  const oauthUrl = await googleOauth.createAuthorizationURL(
    state,
    codeVerifier,
    ['openid', 'profile', 'email'],
  );

  cookiesStore.set(authCookieNames.OAUTH_STATE_GOOGLE, state, {
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 60 * 10,
    sameSite: 'lax',
  });

  cookiesStore.set(authCookieNames.OAUTH_CODE_VERIFIER_GOOGLE, codeVerifier, {
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 60 * 10,
    sameSite: 'lax',
  });

  setRedirectCookie(req.nextUrl.searchParams);

  return NextResponse.redirect(oauthUrl);
}
