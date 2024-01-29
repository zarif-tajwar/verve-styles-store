import {
  index,
  integer,
  pgTable,
  primaryKey,
  serial,
  timestamp,
  unique,
  varchar,
} from 'drizzle-orm/pg-core';
import { products } from './products';
import { sizes } from './sizes';
import { InferInsertModel, relations } from 'drizzle-orm';
import { orderLine } from './orderLine';

export const productEntries = pgTable(
  'product_entries',
  {
    id: serial('id').primaryKey(),
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
    unq: unique('unq').on(table.productID, table.sizeID),
    IdIdx: index('id_idx').on(table.id),
    productIdIdx: index('product_id_idx').on(table.productID),
    sizeIdIdx: index('size_id_idx').on(table.sizeID),
  }),
);

export const productEntryRelations = relations(
  productEntries,
  ({ one, many }) => ({
    product: one(products, {
      fields: [productEntries.productID],
      references: [products.id],
    }),
    size: one(sizes, {
      fields: [productEntries.sizeID],
      references: [sizes.id],
    }),
    orderLine: many(orderLine),
  }),
);

export type ProductEntrySelect = typeof productEntries.$inferSelect;
export type ProductEntryInsert = typeof productEntries.$inferInsert;
