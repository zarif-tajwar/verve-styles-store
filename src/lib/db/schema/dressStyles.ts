import { relations } from 'drizzle-orm';
import { pgTable, serial, timestamp, varchar } from 'drizzle-orm/pg-core';
import { products } from './products';

export const dressStyles = pgTable('dress_styles', {
  id: serial('id').primaryKey(),
  name: varchar('name').notNull(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const dressStyleRelations = relations(dressStyles, ({ many }) => ({
  products: many(products),
}));
