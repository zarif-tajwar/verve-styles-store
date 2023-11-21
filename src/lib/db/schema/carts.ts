import {
  index,
  integer,
  pgTable,
  serial,
  timestamp,
} from 'drizzle-orm/pg-core';
import { users } from './users';
import { InferInsertModel, InferSelectModel, relations } from 'drizzle-orm';
import { cartItems } from './cartItems';

export const carts = pgTable(
  'carts',
  {
    id: serial('id').primaryKey(),
    userId: integer('user_id')
      .references(() => users.id)
      .unique(),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
  },
  (table) => ({
    cartsIdIdx: index('carts_id_idx').on(table.id),
    cartsUserIdIdx: index('carts_user_id_idx').on(table.userId),
  }),
);

export const cartRelations = relations(carts, ({ many }) => ({
  cartItems: many(cartItems),
}));

export type CartsInsert = InferInsertModel<typeof carts>;

export type CartsSelect = InferSelectModel<typeof carts>;
