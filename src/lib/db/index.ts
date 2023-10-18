import { drizzle } from 'drizzle-orm/node-postgres';
import * as sizesSchema from './schema/sizes';
import * as clothingSchema from './schema/clothing';
import * as dressStylesSchema from './schema/dressStyles';
import * as productsSchema from './schema/products';
import * as productEntriesSchema from './schema/productEntries';
import * as cartsSchema from './schema/carts';
import * as cartItemsSchema from './schema/cartItems';
import * as usersSchema from './schema/users';
import * as userReviewsSchema from './schema/userReviews';
import * as ordersSchema from './schema/orders';
import * as orderLineSchema from './schema/orderLine';
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
    ...cartsSchema,
    ...cartItemsSchema,
    ...usersSchema,
    ...userReviewsSchema,
    ...ordersSchema,
    ...orderLineSchema,
  },
});
