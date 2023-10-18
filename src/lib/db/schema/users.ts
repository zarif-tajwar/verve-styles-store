import { relations } from 'drizzle-orm';
import { pgTable, serial, timestamp, varchar } from 'drizzle-orm/pg-core';
import { carts } from './carts';
import { orders } from './orders';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  username: varchar('username').notNull(),
  firstName: varchar('first_name').notNull(),
  lastName: varchar('last_name'),
  email: varchar('email'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const userRelations = relations(users, ({ many }) => ({
  orders: many(orders),
}));
