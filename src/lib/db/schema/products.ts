import {
  index,
  integer,
  numeric,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';
import { clothing } from './clothing';
import { dressStyles } from './dressStyles';
import { InferSelectModel, relations } from 'drizzle-orm';
import { productEntries } from './productEntries';

export const products = pgTable(
  'products',
  {
    id: serial('id').primaryKey(),
    name: varchar('name').notNull(),
    price: numeric('price', {
      precision: 6,
      scale: 2,
    }).notNull(),
    description: text('description'),
    discount: numeric('discount', {
      precision: 3,
      scale: 1,
    }).default('0'),
    color: varchar('color'),
    clothingID: integer('clothing_id').references(() => clothing.id),
    styleID: integer('style_id').references(() => dressStyles.id),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
  },
  (table) => {
    return {
      productIdIdx: index('product_id_index').on(table.id),
      productNameIdx: index('product_name_index').on(table.name),
      productPriceIdx: index('product_price_index').on(table.price),
    };
  },
);

export const productRelations = relations(products, ({ one, many }) => ({
  clothing: one(clothing, {
    fields: [products.clothingID],
    references: [clothing.id],
  }),
  style: one(dressStyles, {
    fields: [products.styleID],
    references: [dressStyles.id],
  }),
  productEntry: many(productEntries),
}));

export type ProductSelect = InferSelectModel<typeof products>;
