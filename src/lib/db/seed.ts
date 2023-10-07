import { SQL, and, eq, inArray, sql } from 'drizzle-orm';
import {
  PgDialect,
  PgTableWithColumns,
  QueryBuilder,
} from 'drizzle-orm/pg-core';
import { db } from './index';
import { clothing } from './schema/clothing';
import { dressStyles } from './schema/dressStyles';
import { products } from './schema/products';
import { sizes } from './schema/sizes';
import { faker } from '@faker-js/faker';
import crypto from 'crypto';
import { ProductEntry, productEntries } from './schema/productEntries';
import { number, object, string, z } from 'zod';
import { SearchQueryUnreservedChars } from '../hooks/useQueryParams';
import { FilterSearchQueryValuesSchema } from '../validation/schemas';

async function populateSizes() {
  await db
    .insert(sizes)
    .values(
      ['Small', 'Medium', 'Large', 'XL', '2XL'].map((name) => ({ name })),
    );
}

async function populateClothing() {
  await db.insert(clothing).values(
    ['t-shirts', 'shorts', 'shirts', 'hoodies', 'jeans'].map((name) => ({
      name,
    })),
  );
}

async function populateStyles() {
  await db.insert(dressStyles).values(
    ['casual', 'formal', 'party', 'gym'].map((name) => ({
      name,
    })),
  );
}

async function populateProducts(n: number) {
  await db.insert(products).values(
    [...Array(n).keys()].map((_) => ({
      name: faker.commerce.productName(),
      price: faker.commerce.price({ min: 100, max: 10000 }),
      clothingID: faker.number.int({ min: 1, max: 5 }),
      styleID: faker.number.int({ min: 1, max: 4 }),
      color: faker.color.human(),
      description: faker.commerce.productDescription(),
    })),
  );
}

function range(start: number, end: number) {
  return [...Array(end - start + 1).keys()].map((_, i) => i + start);
}

function genRandomInt(start: number, end: number) {
  return Math.floor(start + Math.random() * (end - start + 1));
}

async function populateProductEntries() {
  let entryProductAndSizeID: [number, number][] = [];
  const to1000 = range(1, 1000);
  const to5 = range(1, 5);
  const combinations = to1000.flatMap((x) => to5.map((y) => [x, y]));

  while (entryProductAndSizeID.length < 2000) {
    const index = genRandomInt(1, combinations.length);
    const pickedCombination = combinations[index] as [number, number];

    if (
      !entryProductAndSizeID.some(
        (arr: [number, number]) =>
          arr.at(0) === pickedCombination.at(0) &&
          arr.at(1) === pickedCombination.at(1),
      )
    ) {
      entryProductAndSizeID.push(pickedCombination);
    }
  }

  const sizeTags = ['sm', 'md', 'lg', 'xl', '2xl'];
  const clothingTags = ['tsh', 'sho', 'sh', 'ho', 'je'];

  const productNames = await db.query.products.findMany({
    columns: {
      id: true,
      name: true,
    },
    with: {
      clothing: {
        columns: {
          id: true,
          name: true,
        },
      },
    },
  });

  const skus = entryProductAndSizeID.map(([productID, sizeID]) => {
    const product = productNames.find((x) => x.id === productID);

    const productName = product?.name.split(' ')[0];

    const clothing = clothingTags[product?.clothing?.id! - 1];
    const sizeName = sizeTags.at(sizeID - 1);

    const uuid = crypto.randomUUID().slice(0, 4);

    return `${clothing}-${productName}-${sizeName}-${uuid}`.toLocaleLowerCase();
  });

  const inputProductEntries: ProductEntry[] = entryProductAndSizeID.map(
    ([productID, sizeID], i) => ({
      productID: productID,
      sizeID: sizeID,
      quantity: genRandomInt(20, 40),
      sku: skus.at(i)!,
    }),
  );

  await db.insert(productEntries).values(inputProductEntries);
}

const exampleSearchParam = {
  price_range: '500-800',
  clothing: 'tshirts,shirts,jeans',
  sizes: 'xl,lg,md',
  styles: 'formal,casual',
  sort_by: 'price high to low',
};

// console.log(FilterSearchQueryValuesSchema.parse(exampleSearchParam));

const getProductsFromDB = async (inputSearchParams: {
  [key: string]: string;
}) => {
  const parsed = FilterSearchQueryValuesSchema.safeParse(inputSearchParams);

  if (!parsed.success) return;

  const { data } = parsed;

  const conditionals = Array.from(Object.entries(data)).filter(
    ([key, val]) => val !== undefined && key !== 'sort_by',
  );

  const sqlCunks: SQL[] = [];

  sqlCunks.push(
    sql`select distinct ${products.id}, ${products.name}, ${products.price} from ${products}`,
  );

  if (conditionals.length > 0) {
    if (data.clothing !== undefined) {
      sqlCunks.push(
        sql`join ${clothing} on ${products.clothingID} = ${clothing.id}`,
      );
    }

    if (data.styles !== undefined) {
      sqlCunks.push(
        sql`join ${dressStyles} on ${products.styleID} = ${dressStyles.id}`,
      );
    }

    if (data.sizes !== undefined) {
      sqlCunks.push(
        sql`join ${productEntries} on ${products.id} = ${productEntries.productID}`,
      );
      sqlCunks.push(
        sql`join ${sizes} on ${productEntries.sizeID} = ${sizes.id}`,
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
      conditionals.push(sql`${sizes.name} in ${data.sizes}`);
    }

    if (conditionals.length >= 2)
      sqlCunks.push(sql.join(conditionals, sql.raw(' and ')));
    if (conditionals.length === 1)
      sqlCunks.push(sql.join(conditionals, sql.raw(' ')));
  }

  if (data.sort_by !== undefined) {
    if (data.sort_by === 'price low to high') {
      sqlCunks.push(sql`order by ${products.price}`);
    }
    if (data.sort_by === 'price high to low') {
      sqlCunks.push(sql`order by ${products.price} desc`);
    }
  }

  const finalSql: SQL = sql.join(sqlCunks, sql.raw(' '));

  // const sqlString = new PgDialect().sqlToQuery(finalSql);

  const recievedData = await db.execute(finalSql);

  return recievedData;
};

async function execute() {
  console.log('⏳ Running ...');

  const start = performance.now();

  const data = await getProductsFromDB(exampleSearchParam);

  console.log(data?.rows);

  const end = performance.now();

  console.log(`✅ Completed in ${end - start}ms`);

  process.exit(0);
}

execute().catch((err) => {
  console.error('❌ Task failed');
  console.error(err);
  process.exit(1);
});
