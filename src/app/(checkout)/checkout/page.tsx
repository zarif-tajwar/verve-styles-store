import ShippingAddress from './ShippingAddress';

import { Button } from '@/components/UI/Button';
import { Container } from '@/components/UI/Container';
import { redirectIfNotSignedIn } from '@/lib/server/auth';
import { getCartItemsForCheckout } from '@/lib/server/checkout';
import { ArrowLeftIcon } from '@heroicons/react/16/solid';
import Link from 'next/link';
import CheckoutCartItems from './CheckoutCartItems';
import PaymentSection from './PaymentSection';
import TestArea from './TestArea';

const CheckoutPage = async () => {
  const authObject = await redirectIfNotSignedIn({
    redirectAfter: '/checkout',
  });

  const cartItems = await getCartItemsForCheckout({
    userId: authObject.user.id,
    sort: true,
  });

  return (
    <div className="py-6 md:py-10">
      <Container className="p-2">
        {cartItems && cartItems.length > 0 ? (
          <div className="min-h-[140svh]">
            <div className="grid gap-10 lg:grid-cols-[1fr_minmax(400px,0.6fr)]">
              <div className="space-y-10 rounded-main">
                <ShippingAddress />
                <CheckoutCartItems cartItems={cartItems} />
              </div>
              <div className="space-y-16">
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
