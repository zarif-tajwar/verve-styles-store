import {
  integer,
  numeric,
  pgTable,
  serial,
  timestamp,
} from 'drizzle-orm/pg-core';
import { orders } from './orders';
import { productEntries } from './productEntries';

export const orderLine = pgTable('order_line', {
  id: serial('id').primaryKey(),
  orderId: integer('order_id')
    .references(() => orders.id)
    .notNull(),
  productEntryId: integer('product_entry_id')
    .references(() => productEntries.id)
    .notNull(),
  quantity: integer('quantity').notNull(),
  price: numeric('price', {
    precision: 6,
    scale: 2,
  }).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});
