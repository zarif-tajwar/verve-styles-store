import { SQL, sql } from 'drizzle-orm';
import { clothing } from '../db/schema/clothing';
import { products } from '../db/schema/products';
import { FilterSearchQueryValuesSchema } from '../validation/schemas';
import { dressStyles } from '../db/schema/dressStyles';
import { productEntries } from '../db/schema/productEntries';
import { sizes } from '../db/schema/sizes';
import { db } from '../db';
import { PgDialect } from 'drizzle-orm/pg-core';
import { FILTER_PRODUCTS_PER_PAGE } from '../validation/constants';
import { productRating } from '../db/schema/productRating';

export const getProductsFromDB = async (inputSearchParams: {
  [key: string]: string | string[] | undefined;
}) => {
  const parsed = FilterSearchQueryValuesSchema.safeParse(inputSearchParams);

  if (!parsed.success) return;

  const { data } = parsed;

  const conditionals = Array.from(Object.entries(data)).filter(
    ([key, val]) => val !== undefined && key !== 'sort_by' && key !== 'page',
  );

  const sqlCunks: SQL[] = [];

  sqlCunks.push(
    sql`select distinct ${products.id}, ${products.name}, ${products.price}, ${clothing.name} as category, ${productRating.averageRating}, count(*) over() as total_count from ${products}`,
  );

  sqlCunks.push(
    sql`join ${clothing} on ${products.clothingID} = ${clothing.id}`,
  );

  sqlCunks.push(
    sql`left join ${productRating} on ${products.id} = ${productRating.productId}`,
  );

  if (conditionals.length > 0) {
    if (data.styles !== undefined) {
      sqlCunks.push(
        sql`join ${dressStyles} on ${products.styleID} = ${dressStyles.id}`,
      );
    }
    sqlCunks.push(sql`where`);

    const conditionals: SQL[] = [];

    if (data.clothing !== undefined) {
      conditionals.push(sql`${clothing.name} in ${data.clothing}`);
    }

    if (data.styles !== undefined) {
      conditionals.push(sql`${dressStyles.name} in ${data.styles}`);
    }

    if (data.price_range !== undefined) {
      conditionals.push(
        sql`${products.price} between ${data.price_range!.at(
          0,
        )} and ${data.price_range!.at(1)}`,
      );
    }

    if (data.sizes !== undefined) {
      conditionals.push(sql`${products.id} in (SELECT ${productEntries.productID} FROM ${productEntries} WHERE ${productEntries.sizeID} IN (SELECT ${sizes.id} FROM ${sizes}
      WHERE ${sizes.name} IN ${data.sizes}
      ))`);
    }

    if (conditionals.length >= 2)
      sqlCunks.push(sql.join(conditionals, sql.raw(' and ')));
    if (conditionals.length === 1)
      sqlCunks.push(sql.join(conditionals, sql.raw(' ')));
  }

  if (data.sort_by !== undefined) {
    if (data.sort_by === 'price low to high') {
      sqlCunks.push(sql`order by ${products.price}, ${products.id}`);
    }
    if (data.sort_by === 'price high to low') {
      sqlCunks.push(sql`order by ${products.price} desc, ${products.id}`);
    }
  }
  sqlCunks.push(sql`LIMIT ${FILTER_PRODUCTS_PER_PAGE}`);

  if (data.page !== undefined) {
    sqlCunks.push(sql`offset ${FILTER_PRODUCTS_PER_PAGE * (data.page - 1)}`);
  }

  const finalSql: SQL = sql.join(sqlCunks, sql.raw(' '));

  // const sqlString = new PgDialect().sqlToQuery(finalSql);

  // console.log('\nINPUT SEARCH PARAMS: ', inputSearchParams);
  // console.log('\nPARSED DATA FROM INPUT SEARCH PARAMS: ', data);
  // console.log('\nSQL QUERY: ', sqlString);

  const recievedData = await db.execute(finalSql);

  // console.log('\nRECIEVED DATA: ', recievedData.rows);

  return recievedData;
};
