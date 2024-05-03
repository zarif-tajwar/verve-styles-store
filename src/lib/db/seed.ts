import 'dotenv/config';
import { sql } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/node-postgres';
import fs from 'fs';
import path from 'node:path';
import { Pool } from 'pg';
import { env } from '../validation/env';
import { productRating } from './schema/productRating';
import { productSalesCount } from './schema/productSalesCount';

const seed = async () => {
  const connectionString = env.DB_URL;

  const connection = new Pool({ connectionString });
  const db = drizzle(connection);

  const script_locations = [
    'src/lib/db/custom-migrations/create-product-order-count-view.sql',
    'src/lib/db/custom-migrations/create-rating-view.sql',
    'src/lib/db/custom-migrations/data.sql',
  ];

  for (let loc of script_locations) {
    const sql_script = fs.readFileSync(path.resolve(loc), 'utf-8');
    await db.execute(sql.raw(sql_script));
  }
};

const refresh = async () => {
  const connectionString = env.DB_URL;

  const connection = new Pool({ connectionString });
  const db = drizzle(connection);

  await db.refreshMaterializedView(productSalesCount);
  await db.refreshMaterializedView(productRating);
};

async function execute() {
  console.log('⏳ Running ...');

  const start = performance.now();

  await seed();
  await refresh();

  const end = performance.now();

  console.log(`✅ Completed in ${end - start}ms`);

  process.exit(0);
}

execute().catch((err) => {
  console.error('❌ Task failed');
  console.error(err);
  process.exit(1);
});
