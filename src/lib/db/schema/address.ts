import {
  pgTable,
  serial,
  text,
  varchar,
  timestamp,
  boolean,
} from 'drizzle-orm/pg-core';
import { user } from './auth';
import { dummyUser } from './dummyUser';
import { relations } from 'drizzle-orm';

export const address = pgTable('address', {
  id: serial('id').primaryKey(),
  address: text('address').notNull(),
  country: varchar('country').notNull(),
  city: varchar('city').notNull(),
  phone: varchar('phone').notNull(),
  label: text('label'),
  type: varchar('type', { enum: ['not-relevant', 'home', 'office'] })
    .default('not-relevant')
    .notNull(),
  userId: text('user_id').references(() => user.id),
  dummyUserId: varchar('dummy_user_id').references(() => dummyUser.id),
  isDefault: boolean('is_default').default(false),
  isSaved: boolean('is_saved').default(false),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export type AddressSelect = typeof address.$inferSelect;
export type AddressInsert = typeof address.$inferInsert;

export const addressRelations = relations(address, ({ one }) => ({
  user: one(user, {
    fields: [address.userId],
    references: [user.id],
  }),
  dummyUser: one(dummyUser, {
    fields: [address.dummyUserId],
    references: [dummyUser.id],
  }),
}));
