import { pgTable, serial, timestamp, varchar } from 'drizzle-orm/pg-core';

export const sizes = pgTable('sizes', {
  id: serial('id').primaryKey(),
  name: varchar('name').notNull(),
  updatedAt: timestamp('updated_at').defaultNow(),
});
