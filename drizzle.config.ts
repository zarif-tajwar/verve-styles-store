import type { Config } from 'drizzle-kit';
import 'dotenv/config';

export default {
  dbCredentials: {
    connectionString: process.env.DB_URL!,
  },
  driver: 'pg',
  breakpoints: true,
  schema: './src/lib/db/schema',
  out: './src/lib/db/migrations',
} satisfies Config;
