import { pgTable, text, varchar } from 'drizzle-orm/pg-core';
import { createId } from '@paralleldrive/cuid2';
import { relations } from 'drizzle-orm';
import { orders } from './orders';
import { address } from './address';

export const dummyUser = pgTable('dummy_user', {
  id: varchar('id', { length: 128 })
    .primaryKey()
    .$defaultFn(() => createId()),
  name: text('name').notNull(),
  email: text('email').notNull(),
  image: text('image'),
});

export const dummyUserRelations = relations(dummyUser, ({ many }) => ({
  orders: many(orders),
  address: many(address),
}));

export type DummyUserSelect = typeof dummyUser.$inferSelect;
export type DummyUserInsert = typeof dummyUser.$inferInsert;
