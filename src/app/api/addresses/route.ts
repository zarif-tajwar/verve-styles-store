import { getSavedAddressesServer } from '@/lib/server/address';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const addresses = await getSavedAddressesServer();
    if (addresses === null) {
      return NextResponse.json({ message: 'Not allowed!' }, { status: 405 });
    }
    return NextResponse.json({ data: addresses });
  } catch (err) {
    return NextResponse.json(
      { message: 'Something went wrong!' },
      { status: 500 },
    );
  }
}
