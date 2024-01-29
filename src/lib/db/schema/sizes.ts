import { relations } from 'drizzle-orm';
import { pgTable, serial, timestamp, varchar } from 'drizzle-orm/pg-core';
import { productEntries } from './productEntries';

export const sizes = pgTable('sizes', {
  id: serial('id').primaryKey(),
  name: varchar('name').notNull(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const sizeRelations = relations(sizes, ({ many }) => ({
  productEntry: many(productEntries),
}));

export type SizeSelect = typeof sizes.$inferSelect;
export type SizeInsert = typeof sizes.$inferInsert;
