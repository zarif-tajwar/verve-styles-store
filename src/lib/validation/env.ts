import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  server: {
    AUTH_GOOGLE_ID: z.string(),
    AUTH_GOOGLE_SECRET: z.string(),
    AUTH_GOOGLE_REDIRECT_URI: z.string(),
    AUTH_FACEBOOK_ID: z.string(),
    AUTH_FACEBOOK_SECRET: z.string(),
    AUTH_FACEBOOK_REDIRECT_URI: z.string(),

    STRIPE_SECRET_KEY: z.string(),
    STRIPE_WEBHOOK_KEY: z.string(),
    SQID_SECRET: z.string(),
    DB_URL: z.string(),

    SMTP_HOST: z.string(),
    SMTP_PORT: z.coerce.number(),
    SMTP_USER: z.string(),
    SMTP_PASS: z.string(),
    SMTP_FROM: z.string(),
  },
  client: {
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string(),
  },
  runtimeEnv: {
    AUTH_GOOGLE_ID: process.env.AUTH_GOOGLE_ID,
    AUTH_GOOGLE_SECRET: process.env.AUTH_GOOGLE_SECRET,
    AUTH_GOOGLE_REDIRECT_URI: process.env.AUTH_GOOGLE_REDIRECT_URI,
    AUTH_FACEBOOK_ID: process.env.AUTH_FACEBOOK_ID,
    AUTH_FACEBOOK_SECRET: process.env.AUTH_FACEBOOK_SECRET,
    AUTH_FACEBOOK_REDIRECT_URI: process.env.AUTH_FACEBOOK_REDIRECT_URI,

    SMTP_HOST: process.env.SMTP_HOST,
    SMTP_PORT: process.env.SMTP_PORT,
    SMTP_USER: process.env.SMTP_USER,
    SMTP_PASS: process.env.SMTP_PASS,
    SMTP_FROM: process.env.SMTP_FROM,

    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    STRIPE_WEBHOOK_KEY: process.env.STRIPE_WEBHOOK_KEY,
    SQID_SECRET: process.env.SQID_SECRET,
    DB_URL: process.env.DB_URL,
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY:
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
  },
});
