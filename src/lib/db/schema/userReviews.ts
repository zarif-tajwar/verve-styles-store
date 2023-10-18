import {
  integer,
  numeric,
  pgTable,
  serial,
  text,
  timestamp,
} from 'drizzle-orm/pg-core';
import { orderLine } from './orderLine';
import { relations } from 'drizzle-orm';

export const userReviews = pgTable('user_reviews', {
  id: serial('id').primaryKey(),
  orderLineId: integer('order_line_id')
    .references(() => orderLine.id)
    .notNull(),
  comment: text('comment'),
  rating: numeric('rating', {
    precision: 2,
    scale: 1,
  }).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const userReviewsRelations = relations(userReviews, ({ one, many }) => ({
  orderLineId: one(orderLine, {
    fields: [userReviews.orderLineId],
    references: [orderLine.id],
  }),
}));
