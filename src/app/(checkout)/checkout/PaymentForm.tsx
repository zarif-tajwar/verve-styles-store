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
import { FormEvent } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { useCheckoutAddress } from './useCheckoutAddress';

const PaymentForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  // const { execute, result } = useAction(createPaymentIntent);
  const { addressId, dataGetter, isValid, shippingAddressMode, trigger } =
    useCheckoutAddress();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!stripe || !elements) {
      return;
    }

    messageToast('Payment Submitted!');

    const { error: submitError } = await elements.submit();

    if (submitError) {
      errorToast('Payment Submit Error');
    }

    const { data } = await createPaymentIntent({});

    // const { data } = result;

    if (!data?.client_secret) {
      errorToast('No client secret recieved!');
      return;
    }

    messageToast('Payment Initiated!');

    const clientSecret = data.client_secret;

    const { error, paymentIntent } = await stripe.confirmPayment({
      clientSecret,
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/donate-with-elements/result`,
        payment_method_data: { billing_details: { name: 'Zarif Tajwar' } },
      },
      redirect: 'if_required',
    });

    if (error) {
      errorToast('Something went wrong while confirming the payment!');
    }

    if (paymentIntent?.status === 'succeeded') {
      successToast('Success');
    }
  };

  console.log('PAYMENT FORM RENDERED');

  const handleOrderPreparation = () => {
    if (shippingAddressMode === 'input') {
      if (isValid) {
        successToast('Address Form Is Valid');
      } else {
        trigger?.();
        errorToast('Address Form Is Invalid');
      }
    }
    if (shippingAddressMode === 'select') {
      successToast(addressId + 'Address ID');
    }
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleOrderPreparation();
      }}
    >
      {/* <form onSubmit={handleSubmit}> */}
      <PaymentElement />
      <Button
        type="submit"
        roundness={'lg'}
        size={'lg'}
        className="mt-8 w-full"
      >
        Place Order
      </Button>
    </form>
  );
};
export default PaymentForm;
