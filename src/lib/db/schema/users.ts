import { pgTable, serial, timestamp, varchar } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  username: varchar('username').notNull(),
  firstName: varchar('first_name').notNull(),
  lastName: varchar('last_name'),
  email: varchar('email'),
  createdAt: timestamp('created_at').defaultNow(),
});
