import { relations } from 'drizzle-orm';
import {
  pgTable,
  text,
  timestamp,
  boolean,
  primaryKey,
  integer,
  index,
} from 'drizzle-orm/pg-core';
import { orders } from './orders';
import { address } from './address';
import { carts } from './carts';

export const user = pgTable(
  'user',
  {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    email: text('email').notNull().unique(),
    emailVerified: boolean('email_verified').default(false),
    image: text('image'),
    role: text('role', { enum: ['USER', 'ADMIN', 'TEST_USER'] }).default(
      'USER',
    ),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
  },
  (table) => ({
    userIdIdx: index('user_id_idx').on(table.id),
    userEmailIdx: index('user_email_idx').on(table.email),
  }),
);

export type UserSelect = typeof user.$inferSelect;
export type UserInsert = typeof user.$inferInsert;

export const userRelations = relations(user, ({ one, many }) => ({
  orders: many(orders),
  address: many(address),
  carts: one(carts),
}));

export const emailVerification = pgTable('email_verification', {
  id: text('id').primaryKey(),
  code: integer('code').notNull(),
  email: text('email').notNull(),
  ip: text('ip').notNull(),
  expiresAt: timestamp('expires_at', {
    withTimezone: true,
    mode: 'date',
  }).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const passwordResetToken = pgTable('password_reset_token', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  expiresAt: timestamp('expires_at', {
    withTimezone: true,
    mode: 'date',
  }).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const session = pgTable(
  'session',
  {
    id: text('id').primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    expiresAt: timestamp('expires_at', {
      withTimezone: true,
      mode: 'date',
    }).notNull(),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
  },
  (table) => ({
    sessionUserIdIdx: index('session_user_id_idx').on(table.userId),
  }),
);

export const credentialsAccount = pgTable(
  'credentials_account',
  {
    userId: text('user_id')
      .references(() => user.id, { onDelete: 'cascade' })
      .primaryKey(),
    hashedPassword: text('hashed_password').notNull(),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
  },
  (table) => ({
    credentialUserIdIdx: index('credential_user_id_idx').on(table.userId),
  }),
);

export const supportedOauthProviders = ['google', 'facebook'] as const;

export const oauthAccount = pgTable(
  'oauth_account',
  {
    userId: text('user_id')
      .references(() => user.id, { onDelete: 'cascade' })
      .notNull(),
    provider: text('provider', { enum: supportedOauthProviders }).notNull(),
    providerId: text('provider_id').notNull(),
    email: text('email').notNull(),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.provider, table.providerId] }),
      oauthUserIdIndex: index('oauth_user_id_idx').on(table.userId),
    };
  },
);
