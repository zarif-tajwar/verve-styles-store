'use client';
import { Elements } from '@stripe/react-stripe-js';
import PaymentForm from './PaymentForm';
import getStripe from '@/lib/stripe/client-side';
import GeistFont from '@/app/_fonts/geist/font';

const PaymentElements = () => {
  return (
    <div>
      <div className="mb-8 space-y-1">
        <h3 className="text-xl font-semibold">Payment Details</h3>
        <p className="text-sm text-primary-400">
          Enter your payment information and click place order
        </p>
      </div>
      <Elements
        stripe={getStripe()}
        options={{
          currency: 'usd',
          mode: 'payment',
          amount: 47 * 100,

          appearance: {
            theme: 'flat',
            variables: {
              borderRadius: '0.5rem',
              fontFamily: `Roboto, sans-serif`,
            },
          },
          fonts: [
            {
              family: 'GeistSans',
              src: 'F:\\Portfolio\\ecom-cloths-next\\src\\app\\_fonts\\geist\\GeistVF.woff2',
            },
          ],
        }}
      >
        <PaymentForm />
      </Elements>
    </div>
  );
};
export default PaymentElements;
