import { integer, pgTable, serial, timestamp } from 'drizzle-orm/pg-core';
import { carts } from './carts';
import { productEntries } from './productEntries';

export const cartItems = pgTable('cart_items', {
  id: serial('id').primaryKey(),
  cartId: integer('cart_id')
    .references(() => carts.id)
    .notNull(),
  productEntryId: integer('product_entry_id')
    .references(() => productEntries.id)
    .notNull(),
  quantity: integer('quantity').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});
