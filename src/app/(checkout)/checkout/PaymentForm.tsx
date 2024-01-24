'use client';

import { Button } from '@/components/UI/Button';
import {
  errorToast,
  messageToast,
  successToast,
} from '@/components/UI/Toaster';
import { createPaymentIntent } from '@/lib/actions/stripe';
import { useCheckoutStore } from '@/lib/store/checkout-store';
import {
  PaymentElement,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js';
import { useAction } from 'next-safe-action/hooks';
import { FormEvent, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { useCheckoutAddress } from './useCheckoutAddress';
import { performCheckoutAction } from '@/lib/actions/checkout';
import { cn } from '@/lib/util';
import Spinner from '@/components/UI/Spinner';
import { CheckCircleIcon, CheckIcon } from '@heroicons/react/20/solid';

const PaymentForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const { getCheckoutAddress } = useCheckoutAddress();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(true);

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

    const { orderId, stripeClientSecret } = data;

    if (!stripeClientSecret) {
      errorToast('Something went wrong with Stripe Payment', {
        description: 'Please try again',
      });
      return;
    }

    const { error, paymentIntent } = await stripe.confirmPayment({
      clientSecret: stripeClientSecret,
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/result`,
      },
      redirect: 'if_required',
    });

    if (error) {
      errorToast('Something went wrong while confirming the payment!');
    }

    if (paymentIntent?.status === 'succeeded') {
      setIsSuccess(true);
      successToast('Your order was placed successfully');
    }
  };

  console.log('PAYMENT FORM RENDERED');

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        setIsLoading(true);
        await handleCheckout();
        setIsLoading(false);
      }}
    >
      <PaymentElement />
      <Button
        type="submit"
        roundness={'lg'}
        size={'lg'}
        className={cn(
          'mt-8 w-full',
          isSuccess &&
            'gap-2 bg-emerald-500 text-primary-0 disabled:opacity-100',
        )}
        disabled={isLoading || isSuccess}
      >
        {!isLoading && !isSuccess && 'Place Order'}
        {isLoading && (
          <>
            <Spinner size={20} />
            {'Placing your order'}
          </>
        )}
        {isSuccess && (
          <>
            <CheckCircleIcon className="size-5" />
            {'Success'}
          </>
        )}
      </Button>
    </form>
  );
};
export default PaymentForm;
