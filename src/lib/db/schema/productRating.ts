import {
  GetColumnsTableName,
  integer,
  numeric,
  pgMaterializedView,
} from 'drizzle-orm/pg-core';
import { type InferModelFromColumns, InferColumnsDataTypes } from 'drizzle-orm';

export const productRating = pgMaterializedView('product_rating_view', {
  productId: integer('product_id'),
  averageRating: numeric('average_rating', {
    precision: 2,
    scale: 1,
  }),
}).existing();
