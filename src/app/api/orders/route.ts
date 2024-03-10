import { getOrdersServer } from '@/lib/server/user';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const orders = await getOrdersServer({
      searchParams: Object.fromEntries(req.nextUrl.searchParams.entries()),
    });
    if (orders === null) {
      return NextResponse.json({ message: 'Not allowed!' }, { status: 405 });
    }
    return NextResponse.json({ data: orders });
  } catch (err) {
    return NextResponse.json(
      { message: 'Something went wrong!' },
      { status: 500 },
    );
  }
}
