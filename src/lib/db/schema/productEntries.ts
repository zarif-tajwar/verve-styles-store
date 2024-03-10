import { relations } from 'drizzle-orm';
import {
  index,
  integer,
  pgTable,
  serial,
  timestamp,
  unique,
  varchar,
} from 'drizzle-orm/pg-core';
import { orderLine } from './orderLine';
import { products } from './products';
import { sizes } from './sizes';

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
    entry_productIdIdx: index('entry_product_id_idx').on(table.productID),
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
