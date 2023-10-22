import { InferSelectModel, relations } from 'drizzle-orm';
import {
  index,
  pgTable,
  serial,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';
import { products } from './products';

export const clothing = pgTable(
  'clothing',
  {
    id: serial('id').primaryKey(),
    name: varchar('name').notNull(),
    updatedAt: timestamp('updated_at').defaultNow(),
  },
  (table) => {
    return {
      clothingNameIdx: index('clothing_name_index').on(table.name),
    };
  },
);

export const clothingRelations = relations(clothing, ({ many }) => ({
  products: many(products),
}));

export type ClothingSelect = InferSelectModel<typeof clothing>;
