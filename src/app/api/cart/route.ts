import { auth } from '@/auth';
import { CartsSelect } from '@/lib/db/schema/carts';
import { getCartItems, getGuestUserCartId } from '@/lib/server/cart';
import { decodeSingleSqid } from '@/lib/server/sqids';
import { NextResponse } from 'next/server';

export const GET = auth(async function GET(req) {
  try {
    let cartId: CartsSelect['id'] | undefined = undefined;

    // if logged in
    if (req.auth?.user.cartId) {
      cartId = decodeSingleSqid(req.auth.user.cartId);
    }

    // if guest user
    if (!req.auth) {
      cartId = await getGuestUserCartId(true);
    }

    // if theres still no cart
    if (!cartId) {
      return NextResponse.json(
        { message: 'Cart was not found!' },
        { status: 500 },
      );
    }

    const cartItems = await getCartItems({
      cartId,
      isGuestFetcher: !req.auth,
    });

    return NextResponse.json({ data: cartItems });
  } catch (error) {
    return NextResponse.json(
      { message: 'Something went wrong while fetching the cart!' },
      { status: 500 },
    );
  }
});
