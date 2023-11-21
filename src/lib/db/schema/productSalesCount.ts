import { integer, pgMaterializedView } from 'drizzle-orm/pg-core';

export const productSalesCount = pgMaterializedView(
  'product_sales_count_view',
  {
    productId: integer('product_id'),
    totalSales: integer('total_sales'),
  },
).existing();
