import { index, pgTable, serial, timestamp, text } from 'drizzle-orm/pg-core';
import { InferInsertModel, InferSelectModel, relations } from 'drizzle-orm';
import { cartItems } from './cartItems';
import { user } from './auth2';

export const carts = pgTable(
  'carts',
  {
    id: serial('id').primaryKey(),
    userId: text('user_id').references(() => user.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
  },
  (table) => ({
    cartsIdIdx: index('carts_id_idx').on(table.id),
    cartsUserIdIdx: index('carts_user_id_idx').on(table.userId),
  }),
);

export const cartRelations = relations(carts, ({ one, many }) => ({
  cartItems: many(cartItems),
}));

export type CartsInsert = InferInsertModel<typeof carts>;

export type CartsSelect = InferSelectModel<typeof carts>;
