import ShippingAddress from './ShippingAddress';

import CheckoutCartItems from './CheckoutCartItems';
import { auth, dedupedAuth } from '@/auth';
import { redirect } from 'next/navigation';
import { getCartItemsForCheckout } from '@/lib/server/checkout';
import PaymentSection from './PaymentSection';
import Link from 'next/link';

const CheckoutPage = async () => {
  const session = await dedupedAuth();
  if (!session) redirect('/auth/sign-in');
  if (!session.user.cartId) redirect('/shop');

  const cartItems = await getCartItemsForCheckout({
    cartId: session.user.cartId,
    sort: true,
  });

  return (
    <div className="container-main">
      {cartItems && cartItems.length > 0 ? (
        <div className="grid grid-cols-[1fr_0.6fr]">
          <div className="grid gap-16 py-20">
            <ShippingAddress />
            <CheckoutCartItems cartItems={cartItems} />
          </div>
          <div className="grid gap-16 py-14">
            <PaymentSection cartItems={cartItems} />
          </div>
        </div>
      ) : (
        <div>
          <div>Your cart is empty! Add some cloths in your cart first.</div>
          <Link href={'/shop'}>Go back to shop</Link>
        </div>
      )}
    </div>
  );
};
export default CheckoutPage;
