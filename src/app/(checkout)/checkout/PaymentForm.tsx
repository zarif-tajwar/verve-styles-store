'use client';

import { Button } from '@/components/UI/Button';
import {
  errorToast,
  messageToast,
  successToast,
} from '@/components/UI/Toaster';
import {
  PaymentElement,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js';
import { useState } from 'react';
import { useCheckoutAddress } from './useCheckoutAddress';
import { performCheckoutAction } from '@/lib/actions/checkout';
import { cn, wait } from '@/lib/util';
import Spinner from '@/components/UI/Spinner';
import { CheckCircleIcon } from '@heroicons/react/20/solid';
import { useRouter } from 'next/navigation';

const PaymentForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const { getCheckoutAddress } = useCheckoutAddress();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();

  const handleCheckout = async () => {
    if (!stripe || !elements) {
      messageToast('Please try again!');
      return;
    }

    const shippingAddress = getCheckoutAddress();

    if (!shippingAddress) {
      errorToast('Something went wrong with the address!');
      return;
    }

    const { error: submitError } = await elements.submit();

    if (submitError) {
      return;
    }

    const { data, serverError, validationErrors } = await performCheckoutAction(
      { shippingAddress },
    );

    if (serverError) {
      errorToast(serverError);
      return;
    }
    if (validationErrors) {
      errorToast('Something went wrong with data validation');
      return;
    }

    if (!data) {
      errorToast('Something went wrong with the checkout', {
        description: 'Please try again',
      });
      return;
    }

    if (data.isThereUnavailableProduct) {
      errorToast(
        'At least one of your ordered products is not available due to low stock',
        {
          description: 'Redirecting you to the cart page',
          duration: 5000,
        },
      );
      router.replace('/cart');
      return;
    }

    const { orderId, stripeClientSecret } = data;

    if (!stripeClientSecret) {
      errorToast('Something went wrong with Stripe Payment', {
        description: 'Please try again',
      });
      return;
    }

    const href = `/my-account/orders/${orderId}`;

    const { error, paymentIntent } = await stripe.confirmPayment({
      clientSecret: stripeClientSecret,
      elements,
      confirmParams: {
        return_url: `${window.location.origin}${href}`,
      },
      redirect: 'if_required',
    });

    if (error) {
      errorToast('Something went wrong while confirming the payment!');
    }

    if (paymentIntent?.status === 'succeeded') {
      setIsSuccess(true);
      successToast('Your order was placed successfully');

      await wait(1000);
      router.replace(href);
    }
  };

  console.log('PAYMENT FORM RENDERED');

  return (
    <form
      onSubmit={async (e) => {
        console.time('checkout');
        e.preventDefault();
        setIsLoading(true);
        await handleCheckout();
        setIsLoading(false);
        console.timeEnd('checkout');
      }}
    >
      <PaymentElement />
      <div className="pt-8">
        {!isSuccess && (
          <Button
            type="submit"
            roundness={'lg'}
            size={'lg'}
            className={cn('w-full')}
            disabled={isLoading}
          >
            {!isLoading && 'Place Order'}
            {isLoading && (
              <>
                <Spinner size={20} />
                {'Placing your order'}
              </>
            )}
          </Button>
        )}
        {isSuccess && (
          <span className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-emerald-500 text-primary-0">
            <CheckCircleIcon className="size-5" />
            {'Success'}
          </span>
        )}
      </div>
    </form>
  );
};
export default PaymentForm;
