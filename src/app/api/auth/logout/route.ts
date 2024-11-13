import { lucia } from '@/auth2';
import { auth } from '@/lib/server/auth';
import { cookies, headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest): Promise<NextResponse> {
  const { session } = await auth();
  if (!session) {
    return NextResponse.json(
      { error: "You're already logged out!" },
      { status: 401 },
    );
  }

  const referer = (await headers()).get('referer');

  await lucia.invalidateSession(session.id);

  const sessionCookie = lucia.createBlankSessionCookie();
  (await cookies()).set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  );

  if (referer) {
    return NextResponse.redirect(referer);
  }

  return NextResponse.redirect('/auth/sign-in');
}
