import type { Config } from 'drizzle-kit';
import { defineConfig } from 'drizzle-kit';
import 'dotenv/config';
import { env } from '@/lib/validation/env';

export default defineConfig({
  dbCredentials: {
    url: env.DB_URL,
  },
  dialect: 'postgresql',
  breakpoints: true,
  schema: './src/lib/db/schema',
  out: './src/lib/db/migrations',
});
