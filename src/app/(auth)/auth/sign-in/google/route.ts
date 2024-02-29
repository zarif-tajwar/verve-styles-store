import { googleOauth } from '@/auth2';
import { generateCodeVerifier, generateState } from 'arctic';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(): Promise<NextResponse> {
  const state = generateState();
  const codeVerifier = generateCodeVerifier();

  const oauthUrl = await googleOauth.createAuthorizationURL(
    state,
    codeVerifier,
    { scopes: ['profile', 'email'] },
  );

  cookies().set('oauth_state_google', state, {
    path: '/',
    secure: false,
    httpOnly: true,
    maxAge: 60 * 10,
    sameSite: 'lax',
  });

  cookies().set('oauth_code_verifier_google', codeVerifier, {
    path: '/',
    secure: false,
    httpOnly: true,
    maxAge: 60 * 10,
    sameSite: 'lax',
  });

  return NextResponse.redirect(oauthUrl, 302);
}
