import {
  integer,
  pgTable,
  serial,
  timestamp,
  unique,
} from 'drizzle-orm/pg-core';
import { carts } from './carts';
import { productEntries } from './productEntries';
import { InferInsertModel, InferSelectModel, relations } from 'drizzle-orm';

export const cartItems = pgTable(
  'cart_items',
  {
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
  },
  (table) => ({
    unq: unique().on(table.cartId, table.productEntryId),
  }),
);

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

export type CartItemsInsert = InferInsertModel<typeof cartItems>;

export type CartItemsSelect = InferSelectModel<typeof cartItems>;
