import {
  pgTable,
  serial,
  text,
  varchar,
  timestamp,
  integer,
  boolean,
} from 'drizzle-orm/pg-core';
import { products } from './products';
import { relations } from 'drizzle-orm';

export const productImages = pgTable('product_images', {
  id: serial('id').primaryKey(),
  url: text('url').notNull(),
  size: integer('size').notNull(),
  isDefault: boolean('is_default').default(false),
  productID: integer('product_id')
    .references(() => products.id)
    .notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const productImagesRelations = relations(productImages, ({ one }) => ({
  products: one(products, {
    fields: [productImages.productID],
    references: [products.id],
  }),
}));

export type ProductImagesSelect = typeof productImages.$inferSelect;
export type ProductImagesInsert = typeof productImages.$inferInsert;
