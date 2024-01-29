import { integer, numeric, pgMaterializedView } from 'drizzle-orm/pg-core';

export const productRating = pgMaterializedView('product_rating_view', {
  productId: integer('product_id'),
  averageRating: numeric('average_rating', {
    precision: 2,
    scale: 1,
  }),
}).existing();
