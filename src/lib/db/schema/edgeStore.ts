import { pgTable, serial, text, timestamp, integer } from 'drizzle-orm/pg-core';

export const edgeStoreImages = pgTable('edge_store_images', {
  id: serial('id').primaryKey(),
  url: text('url').notNull(),
  size: integer('size').notNull(),
  attribute: text('attribute'),
  clothing: text('clothing'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export type EdgeStoreImagesSelect = typeof edgeStoreImages.$inferSelect;
export type EdgeStoreImagesInsert = typeof edgeStoreImages.$inferInsert;
