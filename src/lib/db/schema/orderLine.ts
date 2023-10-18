import {
  integer,
  numeric,
  pgTable,
  serial,
  timestamp,
} from 'drizzle-orm/pg-core';
import { orders } from './orders';
import { productEntries } from './productEntries';
import { relations } from 'drizzle-orm';

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

export const orderLineRelations = relations(orderLine, ({ one, many }) => ({
  orders: one(orders, {
    fields: [orderLine.orderId],
    references: [orders.id],
  }),
  productEntries: one(productEntries, {
    fields: [orderLine.productEntryId],
    references: [productEntries.id],
  }),
}));
