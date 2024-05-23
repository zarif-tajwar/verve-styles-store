// import type { Config } from 'drizzle-kit';
import 'dotenv/config';
import { env } from '@/lib/validation/env';

// export default {
//   dbCredentials: {
//     connectionString: env.DB_URL,
//   },
//   driver: 'pg',

//   breakpoints: true,
//   schema: './src/lib/db/schema',
//   out: './src/lib/db/migrations',
// } satisfies Config;

import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  dialect: 'postgresql',
  dbCredentials: { url: env.DB_URL },
  schema: './src/lib/db/schema',
  out: './src/lib/db/migrations',
  breakpoints: true,
});
