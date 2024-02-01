import { getShopProductsServer } from '@/lib/server/shop';
import { NextRequest, NextResponse } from 'next/server';

export const GET = async (req: NextRequest) => {
  try {
    const searchParams = req.nextUrl.searchParams;
    const searchParamsObject = Object.fromEntries(searchParams.entries());
    const products = await getShopProductsServer(searchParamsObject);
    return NextResponse.json(
      {
        data: products,
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { message: 'Something went wrong!' },
      { status: 500 },
    );
  }
};
