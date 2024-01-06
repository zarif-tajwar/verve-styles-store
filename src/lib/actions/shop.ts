'use server';

import { SQL, and, between, desc, eq, inArray, sql } from 'drizzle-orm';
import { ClothingSelect, clothing } from '@/lib/db/schema/clothing';
import { ProductSelect, products } from '@/lib/db/schema/products';
import { FilterSearchQueryValuesSchema } from '@/lib/validation/schemas';
import { dressStyles } from '@/lib/db/schema/dressStyles';
import { productEntries } from '@/lib/db/schema/productEntries';
import { sizes } from '@/lib/db/schema/sizes';
import { db } from '@/lib/db';
import { PgColumn, PgDialect } from 'drizzle-orm/pg-core';
import { FILTER_PRODUCTS_PER_PAGE } from '@/lib/validation/constants';
import { productRating } from '@/lib/db/schema/productRating';
import { productSalesCount } from '@/lib/db/schema/productSalesCount';
import { SearchParamsServer } from '@/lib/types/common';
import { unstable_noStore as noStore } from 'next/cache';
import { user } from '../db/schema/auth';

export type FilteredProductItem = {
  id: ProductSelect['id'];
  name: ProductSelect['name'];
  price: ProductSelect['price'];
  categoryName: ClothingSelect['name'] | null;
  averageRating: typeof productRating.averageRating._.data | null;
  totalCount: number;
  totalSales?: number | null;
};

export const getShopProductsServer = async (
  inputSearchParams: SearchParamsServer,
): Promise<FilteredProductItem[]> => {
  //   noStore();

  const parsed = FilterSearchQueryValuesSchema.safeParse(inputSearchParams);

  if (!parsed.success) return [];

  const { data } = parsed;

  const conditionals: SQL[] = [];
  const sortingMethods: (PgColumn | SQL)[] = [];

  let query = db
    .selectDistinct({
      id: products.id,
      name: products.name,
      price: products.price,
      categoryName: clothing.name,
      averageRating: productRating.averageRating,
      totalCount: sql<number>`COUNT(*) OVER()`,
      ...(data.sort_by === 'most popular'
        ? { totalSales: productSalesCount.totalSales }
        : {}),
    })
    .from(products)
    .innerJoin(clothing, eq(clothing.id, products.clothingID))
    .leftJoin(productRating, eq(productRating.productId, products.id))
    .$dynamic();

  if (data.clothing !== undefined) {
    conditionals.push(inArray(clothing.name, data.clothing));
  }

  if (data.styles !== undefined) {
    query.leftJoin(dressStyles, eq(dressStyles.id, products.styleID));
    conditionals.push(inArray(dressStyles.name, data.styles));
  }

  if (data.sizes !== undefined) {
    const sq = db
      .selectDistinct({ productId: productEntries.productID })
      .from(productEntries)
      .innerJoin(sizes, eq(productEntries.sizeID, sizes.id))
      .where(inArray(sizes.name, data.sizes));

    conditionals.push(inArray(products.id, sq));
  }

  if (data.price_range !== undefined && data.price_range !== null) {
    const [min, max] = data.price_range;
    if (min !== undefined && max !== undefined) {
      conditionals.push(
        between(products.price, min.toString(), max.toString()),
      );
    }
  }

  if (data.sort_by === 'most popular') {
    query.leftJoin(
      productSalesCount,
      eq(productSalesCount.productId, products.id),
    );
    sortingMethods.push(
      sql`${productSalesCount.totalSales} desc nulls last`,
      products.id,
    );
  }

  if (data.sort_by !== undefined) {
    if (data.sort_by === 'price low to high') {
      sortingMethods.push(products.price, products.id);
    }
    if (data.sort_by === 'price high to low') {
      sortingMethods.push(desc(products.price), products.id);
    }
  }

  if (conditionals.length > 0) {
    query.where(and(...conditionals));
  }

  if (sortingMethods.length > 0) {
    query.orderBy(...sortingMethods);
  }

  query = query.limit(FILTER_PRODUCTS_PER_PAGE);

  if (data.page !== undefined) {
    query.offset(FILTER_PRODUCTS_PER_PAGE * (data.page - 1));
  }

  const productItemResults = await query;

  return productItemResults;
};
