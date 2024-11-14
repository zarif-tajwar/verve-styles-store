'use server';

import Stripe from 'stripe';
import { stripe } from '../stripe/server-side';
import { authorizedActionClient } from './safe-action';

export const createPaymentIntent = authorizedActionClient.action(async () => {
  const paymentIntent: Stripe.PaymentIntent =
    await stripe.paymentIntents.create({
      amount: 48 * 100,
      currency: 'usd',
      automatic_payment_methods: { enabled: true },
    });

  return { client_secret: paymentIntent.client_secret };
});
