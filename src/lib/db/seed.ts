import { db } from './index';
import { clothing } from './schema/clothing';
import { dressStyles } from './schema/dressStyles';
import { products } from './schema/products';
import { sizes } from './schema/sizes';
import { faker } from '@faker-js/faker';

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

async function populateTables() {
  console.log('⏳ Running ...');

  const start = performance.now();

  //   await Promise.all([
  //     populateSizes(),
  //     populateClothing(),
  //     populateStyles(),
  //     populateProducts(1000),
  //   ]);

  const end = performance.now();

  console.log(`✅ Completed in ${end - start}ms`);

  process.exit(0);
}

populateTables().catch((err) => {
  console.error('❌ Task failed');
  console.error(err);
  process.exit(1);
});
