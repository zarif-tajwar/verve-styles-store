import { index, pgTable, serial, timestamp, text } from 'drizzle-orm/pg-core';
// import { user } from './auth';
import { InferInsertModel, InferSelectModel, relations } from 'drizzle-orm';
import { cartItems } from './cartItems';

export const carts = pgTable(
  'carts',
  {
    id: serial('id').primaryKey(),
    userId: text('user_id').unique(),
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
  // user: one(user, {
  //   fields: [carts.userId],
  //   references: [user.id],
  // }),
}));

export type CartsInsert = InferInsertModel<typeof carts>;

export type CartsSelect = InferSelectModel<typeof carts>;
