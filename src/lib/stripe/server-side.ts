import 'server-only';
import Stripe from 'stripe';
import { env } from '@/lib/validation/env';

export const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-04-10',
  typescript: true,
});
