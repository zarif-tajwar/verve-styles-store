import {
  index,
  integer,
  pgTable,
  serial,
  timestamp,
  text,
  varchar,
} from 'drizzle-orm/pg-core';
import { user } from './auth';
import { relations } from 'drizzle-orm';
import { orderLine } from './orderLine';
import { dummyUser } from './dummyUser';
import { orderDetails } from './orderDetails';

export const orders = pgTable(
  'orders',
  {
    id: serial('id').primaryKey(),
    userId: text('user_id').references(() => user.id),
    dummyUserId: varchar('dummy_user_id', { length: 128 }),
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
  dummyUsers: one(dummyUser, {
    fields: [orders.userId],
    references: [dummyUser.id],
  }),
  orderLine: many(orderLine),
  orderDetails: one(orderDetails, {
    fields: [orders.id],
    references: [orderDetails.orderId],
  }),
}));
