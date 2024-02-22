import ShippingAddress from './ShippingAddress';

import CheckoutCartItems from './CheckoutCartItems';
import { auth, dedupedAuth } from '@/auth';
import { redirect } from 'next/navigation';
import { getCartItemsForCheckout } from '@/lib/server/checkout';
import PaymentSection from './PaymentSection';
import Link from 'next/link';
import { decodeSingleSqid } from '@/lib/server/sqids';
import TestArea from './TestArea';
import Logo from '@/components/UI/Logo';
import { Button } from '@/components/UI/Button';
import { ArrowLeftIcon } from '@heroicons/react/16/solid';
import { Container } from '@/components/UI/Container';

const CheckoutPage = async () => {
  const session = await dedupedAuth();
  if (!session) redirect('/auth/sign-in');
  if (!session.user.cartId) redirect('/shop');

  const cartItems = await getCartItemsForCheckout({
    cartId: decodeSingleSqid(session.user.cartId),
    sort: true,
  });

  return (
    <div>
      <Container>
        {cartItems && cartItems.length > 0 ? (
          <div className="min-h-[140svh]">
            <div className="grid grid-cols-[1fr_minmax(400px,0.6fr)] gap-10">
              <div className="grid gap-10 rounded-main">
                <ShippingAddress />
                <CheckoutCartItems cartItems={cartItems} />
              </div>
              <div className="grid">
                <PaymentSection cartItems={cartItems} />
                <TestArea />
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-16">
            <div className="mb-4">
              <p className="text-2xl font-medium">
                Your cart is empty! Add some cloths in your cart first.
              </p>
            </div>
            <Button asChild>
              <Link href={'/shop'} className="gap-2">
                <ArrowLeftIcon className="size-4" />
                Go back to shop
              </Link>
            </Button>
          </div>
        )}
      </Container>
    </div>
  );
};
export default CheckoutPage;
