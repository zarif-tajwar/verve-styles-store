import {
  integer,
  pgTable,
  timestamp,
  serial,
  varchar,
  numeric,
  boolean,
} from 'drizzle-orm/pg-core';
import { orders } from './orders';
import { relations } from 'drizzle-orm';

export const orderPaymentDetails = pgTable('order_payment_details', {
  orderId: integer('order_id')
    .primaryKey()
    .references(() => orders.id),
  paymentMethod: varchar('payment_method', {
    enum: ['stripe', 'dummy'],
    length: 128,
  }),
  paymentMethodSessionId: varchar('payment_method_session_id'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export type OrderPaymentDetailsInsert = typeof orderPaymentDetails.$inferInsert;

export type OrderPaymentDetailsSelect = typeof orderPaymentDetails.$inferSelect;
