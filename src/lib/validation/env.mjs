import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  server: {
    AUTH_GOOGLE_ID: z.string(),
    AUTH_GOOGLE_SECRET: z.string(),
    AUTH_FACEBOOK_ID: z.string(),
    AUTH_FACEBOOK_SECRET: z.string(),
    AUTH_SECRET: z.string(),
    ADMIN_EMAIL: z.string().email(),
    STAFF_EMAIL: z.string().email(),
    SENDGRID_API_KEY: z.string(),
    SENDGRID_HOST: z.string(),
    SENDGRID_PORT: z.coerce.number(),
    SENDGRID_USER: z.string(),
    SENDGRID_EMAIL_FROM: z.string().email(),

    STRIPE_SECRET_KEY: z.string(),
    STRIPE_WEBHOOK_KEY: z.string(),
    SQID_SECRET: z.string(),
    DB_URL: z.string(),
    EDGE_STORE_ACCESS_KEY: z.string(),
    EDGE_STORE_SECRET_KEY: z.string(),
  },
  client: {
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string(),
  },
  runtimeEnv: {
    AUTH_GOOGLE_ID: process.env.AUTH_GOOGLE_ID,
    AUTH_GOOGLE_SECRET: process.env.AUTH_GOOGLE_SECRET,
    AUTH_FACEBOOK_ID: process.env.AUTH_FACEBOOK_ID,
    AUTH_FACEBOOK_SECRET: process.env.AUTH_FACEBOOK_SECRET,
    AUTH_SECRET: process.env.AUTH_SECRET,
    ADMIN_EMAIL: process.env.ADMIN_EMAIL,
    STAFF_EMAIL: process.env.STAFF_EMAIL,
    SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
    SENDGRID_HOST: process.env.SENDGRID_HOST,
    SENDGRID_PORT: process.env.SENDGRID_PORT,
    SENDGRID_USER: process.env.SENDGRID_USER,
    SENDGRID_EMAIL_FROM: process.env.SENDGRID_EMAIL_FROM,

    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    STRIPE_WEBHOOK_KEY: process.env.STRIPE_WEBHOOK_KEY,
    SQID_SECRET: process.env.SQID_SECRET,
    DB_URL: process.env.DB_URL,
    EDGE_STORE_ACCESS_KEY: process.env.EDGE_STORE_ACCESS_KEY,
    EDGE_STORE_SECRET_KEY: process.env.EDGE_STORE_SECRET_KEY,
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY:
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
  },
});