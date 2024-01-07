import { integer, pgMaterializedView } from 'drizzle-orm/pg-core';
import { productEntries } from './productEntries';
import { count, eq, sql, sum } from 'drizzle-orm';
import { orderLine } from './orderLine';
import { db } from '..';

export const productSalesCount = pgMaterializedView(
  'product_sales_count_view',
).as((qb) =>
  qb
    .select({
      productId: productEntries.productID,
      totalSales: sum(orderLine.quantity).as('total_sales'),
    })
    .from(productEntries)
    .innerJoin(orderLine, eq(orderLine.productEntryId, productEntries.id))
    .groupBy(productEntries.productID),
);

// export const productSalesCount = pgMaterializedView(
//   'product_sales_count_view',
//   {
//     productId: integer('product_id'),
//     totalSales: integer('total_sales'),
//   },
// ).existing();

// SELECT
//     pe.product_id,
//     SUM(ol.quantity) AS total_sales
// FROM
//     product_entries pe
//     JOIN order_line ol ON pe.id = ol.product_entry_id
// GROUP BY
//     pe.product_id;
