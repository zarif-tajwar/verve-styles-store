import {
  index,
  integer,
  numeric,
  pgTable,
  serial,
  text,
  timestamp,
} from 'drizzle-orm/pg-core';
import { orderLine } from './orderLine';
import { InferInsertModel, InferSelectModel, relations } from 'drizzle-orm';

export const userReviews = pgTable(
  'user_reviews',
  {
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
  },
  (table) => ({
    userReviewIdIdx: index('user_review_id_idx').on(table.id),
    userReviewOrderLineIdx: index('user_review_order_line_idx').on(
      table.orderLineId,
    ),
  }),
);

export const userReviewsRelations = relations(userReviews, ({ one }) => ({
  orderLineId: one(orderLine, {
    fields: [userReviews.orderLineId],
    references: [orderLine.id],
  }),
}));

export type UserReviewsInsert = InferInsertModel<typeof userReviews>;

export type UserReviewsSelect = InferSelectModel<typeof userReviews>;
