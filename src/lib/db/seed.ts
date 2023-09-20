import { and, eq, inArray, sql } from 'drizzle-orm';
import { db } from './index';
import { clothing } from './schema/clothing';
import { dressStyles } from './schema/dressStyles';
import { products } from './schema/products';
import { sizes } from './schema/sizes';
import { faker } from '@faker-js/faker';
import crypto from 'crypto';
import { ProductEntry, productEntries } from './schema/productEntries';

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

async function populateTables() {
  console.log('⏳ Running ...');

  const start = performance.now();

  //   await Promise.all([
  //     populateSizes(),
  //     populateClothing(),
  //     populateStyles(),
  //     populateProducts(1000),
  //   ]);

  // await populateProductEntries();

  async function generateStaticParams() {
    const slugs = await db.query.products.findMany({
      columns: {
        name: true,
      },
      with: {
        clothing: {
          columns: {
            name: true,
          },
        },
      },
    });

    return slugs.map((slug) => ({
      clothing: slug.clothing?.name,
      products: slug.name.replaceAll(' ', '-').toLowerCase(),
    }));
  }

  const x = await generateStaticParams();

  console.log(x);

  const end = performance.now();

  console.log(`✅ Completed in ${end - start}ms`);

  process.exit(0);
}

populateTables().catch((err) => {
  console.error('❌ Task failed');
  console.error(err);
  process.exit(1);
});
