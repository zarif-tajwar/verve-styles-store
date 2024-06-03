import { auth, getUserObjectClient } from '@/lib/server/auth';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest): Promise<NextResponse> {
  const { session, user } = await auth();
  if (session === null || user === null)
    return NextResponse.json(null, { status: 401 });
  return NextResponse.json(
    { data: getUserObjectClient(user) },
    { status: 200 },
  );
}
