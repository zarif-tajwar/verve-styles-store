import { integer, pgTable, serial, timestamp } from 'drizzle-orm/pg-core';
import { users } from './users';
import { relations } from 'drizzle-orm';
import { cartItems } from './cartItems';

export const carts = pgTable('carts', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .references(() => users.id)
    .notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const cartRelations = relations(carts, ({ one, many }) => ({
  cartItems: many(cartItems),
  users: one(users, {
    fields: [carts.userId],
    references: [users.id],
  }),
}));
