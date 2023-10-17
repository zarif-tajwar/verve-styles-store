import { integer, pgTable, serial, timestamp } from 'drizzle-orm/pg-core';
import { users } from './users';

export const carts = pgTable('carts', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .references(() => users.id)
    .notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});
