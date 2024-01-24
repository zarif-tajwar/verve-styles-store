import {
  integer,
  pgTable,
  timestamp,
  serial,
  varchar,
} from 'drizzle-orm/pg-core';
import { orders } from './orders';
import { relations } from 'drizzle-orm';
import { address } from './address';

export const orderStatus = pgTable('order_status', {
  id: serial('id').primaryKey(),
  text: varchar('text').notNull(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const orderStatusRelations = relations(orderStatus, ({ many }) => ({
  orderDetails: many(orderDetails),
}));

export const orderDetails = pgTable('order_details', {
  orderId: integer('order_id')
    .primaryKey()
    .references(() => orders.id),
  addressId: integer('address_id')
    .notNull()
    .references(() => address.id),
  placedAt: timestamp('placed_at').defaultNow(),
  deliveryDate: timestamp('delivery_date'),
  deliveredAt: timestamp('deliveredAt'),
  updatedAt: timestamp('updated_at').defaultNow(),
  statusId: integer('status_id')
    .notNull()
    .references(() => orderStatus.id),
});

export const orderDetailsRelations = relations(orderDetails, ({ one }) => ({
  orderStatus: one(orderStatus, {
    fields: [orderDetails.statusId],
    references: [orderStatus.id],
  }),
  address: one(address, {
    fields: [orderDetails.addressId],
    references: [address.id],
  }),
}));

export type OrderDetailsInsert = typeof orderDetails.$inferInsert;

export type OrderDetailsSelect = typeof orderDetails.$inferSelect;
