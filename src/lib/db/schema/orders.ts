import {
  index,
  integer,
  pgTable,
  serial,
  timestamp,
  text,
} from 'drizzle-orm/pg-core';
import { user } from './auth';
import { relations } from 'drizzle-orm';
import { orderLine } from './orderLine';

export const orders = pgTable(
  'orders',
  {
    id: serial('id').primaryKey(),
    userId: text('user_id')
      .references(() => user.id)
      .notNull(),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
  },
  (table) => ({
    ordersIdIdx: index('orders_id').on(table.id),
    ordersUserIdIdx: index('orders_user_id_idx').on(table.userId),
  }),
);

export const orderRelations = relations(orders, ({ one, many }) => ({
  users: one(user, {
    fields: [orders.userId],
    references: [user.id],
  }),
  orderLine: many(orderLine),
}));
