import { relations } from 'drizzle-orm';
import { pgTable, serial, timestamp, varchar } from 'drizzle-orm/pg-core';
import { products } from './products';

export const clothing = pgTable('clothing', {
  id: serial('id').primaryKey(),
  name: varchar('name').notNull(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const clothingRelations = relations(clothing, ({ many }) => ({
  products: many(products),
}));
