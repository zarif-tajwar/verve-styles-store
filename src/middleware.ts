import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  if (request.method !== 'GET') {
    const vercelTargetUrl =
      process.env.VERCEL_ENV === 'preview'
        ? process.env.VERCEL_BRANCH_URL
        : process.env.VERCEL_PROJECT_PRODUCTION_URL;

    const vercelOrigin = vercelTargetUrl
      ? `htpps://${vercelTargetUrl}`
      : undefined;

    const targetOrigin =
      vercelOrigin || process.env.WEBSITE_ORIGIN || 'http://localhost:3000';

    const origin = request.headers.get('Origin');

    if (origin === null || origin !== targetOrigin) {
      return NextResponse.json({}, { status: 403 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api/webhooks).*)'],
};
