import {
  pgTable,
  text,
  varchar,
  timestamp,
  integer,
} from 'drizzle-orm/pg-core';
import { orders } from './orders';

export const orderCustomerDetails = pgTable('order_customer_details', {
  orderId: integer('order_id')
    .primaryKey()
    .references(() => orders.id),
  customerName: text('customer_name').notNull(),
  customerEmail: text('customer_email'),
  address: text('address').notNull(),
  country: varchar('country').notNull(),
  city: varchar('city').notNull(),
  phone: varchar('phone').notNull(),
  addressLabel: text('address_label').notNull(),
  addressType: varchar('address_type', {
    enum: ['not-relevant', 'home', 'office'],
  })
    .default('not-relevant')
    .notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export type OrderCustomerDetailsSelect =
  typeof orderCustomerDetails.$inferSelect;
export type OrderCustomerDetailsInsert =
  typeof orderCustomerDetails.$inferInsert;

export type OrderCustomerAddressDetailsInsert = Pick<
  OrderCustomerDetailsInsert,
  'address' | 'city' | 'country' | 'phone' | 'addressLabel' | 'addressType'
>;
