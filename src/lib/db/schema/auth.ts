// import {
//   timestamp,
//   pgTable,
//   text,
//   primaryKey,
//   integer,
//   index,
// } from 'drizzle-orm/pg-core';
// import type { AdapterAccount } from '@auth/core/adapters';
// import { relations } from 'drizzle-orm';
// import { orders } from './orders';
// import { carts } from './carts';
// import { address } from './address';

// export const user = pgTable(
//   'user',
//   {
//     id: text('id').notNull().primaryKey(),
//     name: text('name'),
//     email: text('email').notNull(),
//     emailVerified: timestamp('emailVerified', { mode: 'date' }),
//     image: text('image'),
//     role: text('role', {
//       enum: ['ADMIN', 'STAFF', 'USER', 'TEST USER'],
//     })
//       .notNull()
//       .default('USER'),
//   },
//   (table) => {
//     return {
//       userIdIdx: index('user_id_idx').on(table.id),
//     };
//   },
// );

// export const userRelations = relations(user, ({ one, many }) => ({
//   orders: many(orders),
//   address: many(address),
//   carts: one(carts, {
//     fields: [user.id],
//     references: [carts.userId],
//   }),
// }));

// export const accounts = pgTable(
//   'account',
//   {
//     userId: text('userId')
//       .notNull()
//       .references(() => user.id, { onDelete: 'cascade' }),
//     type: text('type').$type<AdapterAccount['type']>().notNull(),
//     provider: text('provider').notNull(),
//     providerAccountId: text('providerAccountId').notNull(),
//     refresh_token: text('refresh_token'),
//     name: text('name'),
//     email: text('email'),
//     access_token: text('access_token'),
//     expires_at: integer('expires_at'),
//     token_type: text('token_type'),
//     scope: text('scope'),
//     id_token: text('id_token'),
//     session_state: text('session_state'),
//   },
//   (account) => ({
//     cpk: primaryKey({
//       name: 'account_provider_id',
//       columns: [account.provider, account.providerAccountId],
//     }),
//   }),
// );

// export const sessions = pgTable('session', {
//   sessionToken: text('sessionToken').notNull().primaryKey(),
//   userId: text('userId')
//     .notNull()
//     .references(() => user.id, { onDelete: 'cascade' }),
//   expires: timestamp('expires', { mode: 'date' }).notNull(),
// });

// export const verificationTokens = pgTable(
//   'verificationToken',
//   {
//     identifier: text('identifier').notNull(),
//     token: text('token').notNull(),
//     expires: timestamp('expires', { mode: 'date' }).notNull(),
//   },
//   (vt) => ({
//     cpk: primaryKey({
//       name: 'verification_identifier_token',
//       columns: [vt.identifier, vt.token],
//     }),
//   }),
// );

// export type UserSelect = typeof user.$inferSelect;
// export type UserInsert = typeof user.$inferSelect;

// export type SessionSelect = typeof sessions.$inferSelect;
// export type SessionInsert = typeof sessions.$inferInsert;
