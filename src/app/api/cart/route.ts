import { getCartId, getCartItems } from '@/lib/server/cart';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const cartId = await getCartId();

    if (!cartId) {
      return NextResponse.json({ data: [] });
    }

    const cartItems = await getCartItems({
      cartId,
    });

    return NextResponse.json({ data: cartItems });
  } catch (error) {
    return NextResponse.json(
      { message: 'Something went wrong with the cart!' },
      { status: 500 },
    );
  }
}
