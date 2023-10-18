import { integer, pgTable, serial, timestamp } from 'drizzle-orm/pg-core';
import { carts } from './carts';
import { productEntries } from './productEntries';
import { relations } from 'drizzle-orm';

export const cartItems = pgTable('cart_items', {
  id: serial('id').primaryKey(),
  cartId: integer('cart_id')
    .references(() => carts.id)
    .notNull(),
  productEntryId: integer('product_entry_id')
    .references(() => productEntries.id)
    .notNull(),
  quantity: integer('quantity').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const cartItemsRelations = relations(cartItems, ({ one, many }) => ({
  carts: one(carts, {
    fields: [cartItems.cartId],
    references: [carts.id],
  }),
  productEntries: one(productEntries, {
    fields: [cartItems.productEntryId],
    references: [productEntries.id],
  }),
}));
