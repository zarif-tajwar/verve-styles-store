import {
  index,
  integer,
  pgTable,
  primaryKey,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';
import { products } from './products';
import { sizes } from './sizes';
import { InferInsertModel, relations } from 'drizzle-orm';

export const productEntries = pgTable(
  'product_entries',
  {
    productID: integer('product_id')
      .references(() => products.id)
      .notNull(),
    sizeID: integer('size_id')
      .references(() => sizes.id)
      .notNull(),
    quantity: integer('quantity').notNull(),
    sku: varchar('sku').notNull(),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
  },
  (table) => ({
    pk: primaryKey(table.productID, table.sizeID),
    productIdIdx: index('product_id_idx').on(table.productID),
    sizeIdIdx: index('size_id_idx').on(table.sizeID),
  }),
);

export const productEntryRelations = relations(productEntries, ({ one }) => ({
  product: one(products, {
    fields: [productEntries.productID],
    references: [products.id],
  }),
  size: one(sizes, {
    fields: [productEntries.sizeID],
    references: [sizes.id],
  }),
}));

export type ProductEntry = InferInsertModel<typeof productEntries>;
