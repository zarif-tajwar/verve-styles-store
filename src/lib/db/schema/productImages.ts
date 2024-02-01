import { relations } from 'drizzle-orm';
import {
  boolean,
  index,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
} from 'drizzle-orm/pg-core';
import { products } from './products';

export const productImages = pgTable(
  'product_images',
  {
    id: serial('id').primaryKey(),
    url: text('url').notNull(),
    size: integer('size').notNull(),
    isDefault: boolean('is_default').default(false),
    productID: integer('product_id')
      .references(() => products.id)
      .notNull(),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
  },
  (table) => {
    return {
      productImageIdx: index('product_image_idx').on(table.id),
      productImageProductIdIdx: index('product_image_product_id_idx').on(
        table.productID,
      ),
    };
  },
);

export const productImagesRelations = relations(productImages, ({ one }) => ({
  products: one(products, {
    fields: [productImages.productID],
    references: [products.id],
  }),
}));

export type ProductImagesSelect = typeof productImages.$inferSelect;
export type ProductImagesInsert = typeof productImages.$inferInsert;
