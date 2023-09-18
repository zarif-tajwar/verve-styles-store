import { drizzle } from 'drizzle-orm/node-postgres';
import * as sizesSchema from './schema/sizes';
import * as clothingSchema from './schema/clothing';
import * as dressStylesSchema from './schema/dressStyles';
import * as productsSchema from './schema/products';
import * as productEntriesSchema from './schema/productEntries';
import { Pool } from 'pg';
import 'dotenv/config';

const connectionString = process.env.DB_URL!;
const connection = new Pool({
  connectionString,
});

export const db = drizzle(connection, {
  schema: {
    ...sizesSchema,
    ...clothingSchema,
    ...dressStylesSchema,
    ...productsSchema,
    ...productEntriesSchema,
  },
});
