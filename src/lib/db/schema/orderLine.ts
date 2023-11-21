import {
  index,
  integer,
  numeric,
  pgTable,
  serial,
  timestamp,
} from 'drizzle-orm/pg-core';
import { orders } from './orders';
import { productEntries } from './productEntries';
import { InferInsertModel, InferSelectModel, relations } from 'drizzle-orm';

export const orderLine = pgTable(
  'order_line',
  {
    id: serial('id').primaryKey(),
    orderId: integer('order_id')
      .references(() => orders.id)
      .notNull(),
    productEntryId: integer('product_entry_id')
      .references(() => productEntries.id)
      .notNull(),
    quantity: integer('quantity').notNull(),
    pricePerUnit: numeric('price_per_unit', {
      precision: 6,
      scale: 2,
    }).notNull(),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
  },
  (table) => ({
    orderLineIdIdx: index('order_line_id_idx').on(table.id),
    orderLineOrderIdIdx: index('order_line_order_id_idx').on(table.orderId),
    orderLineProductEntryIdx: index('order_line_product_entry_id_idx').on(
      table.productEntryId,
    ),
  }),
);

export const orderLineRelations = relations(orderLine, ({ one, many }) => ({
  orders: one(orders, {
    fields: [orderLine.orderId],
    references: [orders.id],
  }),
  productEntries: one(productEntries, {
    fields: [orderLine.productEntryId],
    references: [productEntries.id],
  }),
}));

export type OrderLinesInsert = InferInsertModel<typeof orderLine>;

export type OrderLinesSelect = InferSelectModel<typeof orderLine>;
