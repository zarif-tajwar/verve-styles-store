'use server';

import Stripe from 'stripe';
import { z } from 'zod';
import { stripe } from '../stripe/server-side';
import { authorizedActionClient } from './safe-action';

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
