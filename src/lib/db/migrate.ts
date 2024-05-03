import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { Pool } from 'pg';
import 'dotenv/config';
import { env } from '@/lib/validation/env';

const runMigrate = async () => {
  if (!env.DB_URL) {
    throw new Error('DB_URL is not defined');
  }

  const connection = new Pool({ connectionString: env.DB_URL });

  const db = drizzle(connection);

  console.log('⏳ Running migrations...');

  const start = performance.now();

  await migrate(db, { migrationsFolder: 'src/lib/db/migrations' });

  const end = performance.now();

  console.log(`✅ Migrations completed in ${end - start}ms`);

  process.exit(0);
};

runMigrate().catch((err) => {
  console.error('❌ Migration failed');
  console.error(err);
  process.exit(1);
});
