import {
  integer,
  pgTable,
  timestamp,
  varchar,
  numeric,
} from 'drizzle-orm/pg-core';
import { orders } from './orders';
import { createId } from '@paralleldrive/cuid2';

export const invoice = pgTable('invoice', {
  id: varchar('id', { length: 128 })
    .primaryKey()
    .$defaultFn(() => createId()),
  orderId: integer('order_id')
    .notNull()
    .references(() => orders.id),
  subtotal: numeric('subtotal').notNull(),
  totalDiscountInCurrency: numeric('total_discount_in_currency').default('0'),
  deliveryCharge: numeric('delivery_charge').notNull(),
  taxes: numeric('taxes').default('0'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export type InvoiceInsert = typeof invoice.$inferInsert;

export type InvoiceSelect = typeof invoice.$inferSelect;
