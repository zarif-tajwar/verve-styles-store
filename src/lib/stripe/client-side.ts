import { Stripe, loadStripe } from '@stripe/stripe-js';
import { env } from '@/lib/validation/env.mjs';

let stripePromise: Promise<Stripe | null>;

export default function getStripe(): Promise<Stripe | null> {
  if (!stripePromise)
    stripePromise = loadStripe(env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

  return stripePromise;
}
