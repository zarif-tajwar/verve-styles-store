// import { relations, InferInsertModel, InferSelectModel } from 'drizzle-orm';
// import {
//   index,
//   pgTable,
//   serial,
//   timestamp,
//   varchar,
// } from 'drizzle-orm/pg-core';
// import { carts } from './carts';
// import { orders } from './orders';

// export const users = pgTable(
//   'users',
//   {
//     id: serial('id').primaryKey(),
//     username: varchar('username').unique().notNull(),
//     firstName: varchar('first_name').notNull(),
//     lastName: varchar('last_name'),
//     email: varchar('email').unique(),
//     createdAt: timestamp('created_at').defaultNow(),
//   },
//   (table) => ({
//     userIdIdx: index('user_id_idx').on(table.id),
//     userNameIdx: index('user_Name_idx').on(table.username),
//   }),
// );

// export const userRelations = relations(users, ({ one, many }) => ({
//   orders: many(orders),
//   carts: one(carts, {
//     fields: [users.id],
//     references: [carts.userId],
//   }),
// }));

// export type UsersInsert = InferInsertModel<typeof users>;

// export type UsersSelect = InferSelectModel<typeof users>;
