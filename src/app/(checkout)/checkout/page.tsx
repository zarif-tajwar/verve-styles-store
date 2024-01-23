import ShippingAddress from './ShippingAddress';
import PaymentElements from './PaymentElements';
import OrderItems from './OrderItems';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { cartItems } from '@/lib/db/schema/cartItems';
import { eq } from 'drizzle-orm';
import { getCartItemsForCheckout } from '@/lib/server/checkout';

const CheckoutPage = async () => {
  const session = await auth();
  if (!session) redirect('/auth/sign-in');
  if (!session.user.cartId) redirect('/shop');

  const orderedItems = await getCartItemsForCheckout(session);

  return (
    <div className="container-main py-24">
      {orderedItems && orderedItems.length > 0 ? (
        <div className="grid grid-cols-[1fr_0.5fr]">
          <div className="grid gap-16">
            <ShippingAddress />
            <OrderItems orderedItems={orderedItems} />
          </div>
          {/* <PaymentElements /> */}
        </div>
      ) : (
        <div>Your cart is empty! Add some cloths in your cart first.</div>
      )}
    </div>
  );
};
export default CheckoutPage;
