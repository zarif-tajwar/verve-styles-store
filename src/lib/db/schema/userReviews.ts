import {
  integer,
  numeric,
  pgTable,
  serial,
  text,
  timestamp,
} from 'drizzle-orm/pg-core';
import { orderLine } from './order_line';

export const userReviews = pgTable('user_reviews', {
  id: serial('id').primaryKey(),
  orderLineId: integer('order_line_id')
    .references(() => orderLine.id)
    .notNull(),
  description: text('description'),
  rating: numeric('rating', {
    precision: 2,
    scale: 1,
  }).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});
