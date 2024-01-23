'use server';

import { number, z } from 'zod';
import { authorizedActionClient } from './safe-action';
import Stripe from 'stripe';
import { stripe } from '../stripe/server-side';

const CreatePaymentIntentSchema = z.object({
  // totalAmount: number(),
});

export const createPaymentIntent = authorizedActionClient(
  CreatePaymentIntentSchema,
  async ({}, {}) => {
    const paymentIntent: Stripe.PaymentIntent =
      await stripe.paymentIntents.create({
        amount: 48 * 100,
        currency: 'usd',
        automatic_payment_methods: { enabled: true },
      });

    return { client_secret: paymentIntent.client_secret };
  },
);
