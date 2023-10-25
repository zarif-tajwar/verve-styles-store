import {
  InferColumnsDataTypes,
  SQL,
  and,
  eq,
  getTableColumns,
  inArray,
  lt,
  sql,
} from 'drizzle-orm';
import {
  PgDialect,
  PgTableWithColumns,
  QueryBuilder,
} from 'drizzle-orm/pg-core';
import { db } from './index';
import { clothing } from './schema/clothing';
import { dressStyles } from './schema/dressStyles';
import { ProductSelect, products } from './schema/products';
import { sizes } from './schema/sizes';
import { faker } from '@faker-js/faker';
import crypto from 'crypto';
import { ProductEntry, productEntries } from './schema/productEntries';
import { FilterSearchQueryValuesSchema } from '../validation/schemas';
import { genRandomInt, wait } from '../util';
import { UsersInsert, users } from './schema/users';
import { CartsInsert, CartsSelect, carts } from './schema/carts';
import { CartItemsInsert, cartItems } from './schema/cartItems';
import { orders } from './schema/orders';
import { OrderLinesInsert, orderLine } from './schema/orderLine';
import { UserReviewsInsert, userReviews } from './schema/userReviews';
import { productRating } from './schema/productRating';
import { productSalesCount } from './schema/productSalesCount';
import { getProductsFromDB } from '../dbCalls/filter';

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

async function populateProductEntries(n: number) {
  let entryProductAndSizeID: [number, number][] = [];

  const existingEntryProductAndSizeID = (
    await db
      .select({
        productId: productEntries.productID,
        sizeId: productEntries.sizeID,
      })
      .from(productEntries)
  ).map((combination) => [combination.productId, combination.sizeId]) as [
    number,
    number,
  ][];

  while (entryProductAndSizeID.length < n) {
    const pickedCombination = [genRandomInt(1, 32000), genRandomInt(1, 5)] as [
      number,
      number,
    ];

    if (
      !entryProductAndSizeID.some(
        (arr: [number, number]) =>
          arr.at(0) === pickedCombination.at(0) &&
          arr.at(1) === pickedCombination.at(1),
      ) &&
      !existingEntryProductAndSizeID.some(
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
      quantity: genRandomInt(800, 1200),
      sku: skus.at(i)!,
    }),
  );

  await db.insert(productEntries).values(inputProductEntries);

  console.log(
    `${inputProductEntries.length} product entries have been populated!`,
  );
}

const updateProductEntryQuantity = async () => {
  const productEntriesId = await db
    .select({ id: productEntries.id })
    .from(productEntries);

  const length = productEntriesId.length;

  const promises = [];

  for (let i = 0; i < length; i++) {
    const promise = new Promise((res) =>
      res(
        db
          .update(productEntries)
          .set({
            quantity: genRandomInt(800, 1200),
          })
          .where(eq(productEntries.id, productEntriesId[i]!.id)),
      ),
    );
    promises.push(promise);
  }

  await Promise.allSettled(promises);
};

const populateUsers = async (n: number) => {
  const randomlyGeneratedUsers: UsersInsert[] = [...Array(n).keys()].map(() => {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();

    const generatedUser = {
      firstName,
      lastName,
      username: faker.internet.userName({ firstName, lastName }).toLowerCase(),
      email: faker.internet.email({ firstName, lastName }).toLowerCase(),
    };

    return generatedUser;
  });

  await db.insert(users).values(randomlyGeneratedUsers);
};

const populateCarts = async (n: number) => {
  const userIdArr = await db
    .select({
      userId: users.id,
    })
    .from(users);

  const alreadyExistingCartsUserIdArr = await db
    .select({
      userId: carts.userId,
    })
    .from(carts);

  const selectedUsersIndex: number[] = [];

  while (selectedUsersIndex.length < n) {
    const randomIndex = genRandomInt(0, userIdArr.length - 1);

    if (selectedUsersIndex.findIndex((val) => val === randomIndex) !== -1)
      continue;

    if (
      alreadyExistingCartsUserIdArr.some(
        (val) => val.userId === userIdArr[randomIndex]!.userId,
      )
    )
      continue;

    selectedUsersIndex.push(randomIndex);
  }

  const generatedCarts: CartsInsert[] = selectedUsersIndex.map((val) => {
    const date = faker.date.past({ years: 1 });
    return {
      userId: userIdArr.at(val)?.userId || 0,
      createdAt: date,
      updatedAt: date,
    };
  });

  await db.insert(carts).values(generatedCarts);
};

const populateCartItems = async (n: number) => {
  const productEntryIdArray = await db
    .select({
      productEntryId: productEntries.id,
    })
    .from(productEntries);

  const cartIdArray = await db
    .select({
      cartId: carts.id,
    })
    .from(carts);

  const cartItemsArray = await db
    .select({
      cartId: cartItems.cartId,
      productEntryID: cartItems.productEntryId,
    })
    .from(cartItems);

  const combinations: [number, number][] = [];

  while (combinations.length < n) {
    const selectedCombination = [
      productEntryIdArray[genRandomInt(0, productEntryIdArray.length - 1)]!
        .productEntryId,
      cartIdArray[genRandomInt(0, cartIdArray.length - 1)]!.cartId,
    ];

    if (
      combinations.some(
        (arr: [number, number]) =>
          arr.at(0) === selectedCombination.at(0) &&
          arr.at(1) === selectedCombination.at(1),
      )
    )
      continue;

    if (
      cartItemsArray.some((item) => {
        item.productEntryID === selectedCombination.at(0) &&
          item.cartId === selectedCombination.at(1);
      })
    )
      continue;

    combinations.push(selectedCombination as [number, number]);
  }

  const generatedCartItems: CartItemsInsert[] = combinations.map(
    ([productEntryId, cartId]) => {
      const date = faker.date.recent();
      return {
        cartId,
        productEntryId,
        // quantity: genRandomInt(200, 800),
        quantity: 200,
        createdAt: date,
        updatedAt: date,
      };
    },
  );

  const promises: Promise<void>[] = [];

  for (let i = 0; i < generatedCartItems.length; i++) {
    const cartItem = generatedCartItems.at(i);

    if (cartItem === undefined) continue;

    const cartItemTransactionPromise = db.transaction(async (tx1) => {
      const res = await tx1
        .select({
          quantity: productEntries.quantity,
        })
        .from(productEntries)
        .where(eq(productEntries.id, cartItem.productEntryId));

      const inventoryQuantity = res.at(0)?.quantity || 0;

      if (inventoryQuantity < cartItem.quantity) {
        await tx1.rollback();
        return;
      }

      await tx1.insert(cartItems).values(cartItem);
    });

    promises.push(cartItemTransactionPromise);
  }

  await Promise.allSettled(promises);

  // await db.insert(cartItems).values(generatedCartItems);
};

const makeRandomOrders = async (n: number) => {
  const getUserIdsPromise = db
    .select({
      userId: users.id,
    })
    .from(users);

  const getProductEntryIdsPromise = db
    .select({
      productEntryId: productEntries.id,
    })
    .from(productEntries);

  const [userIds, productEntryIds] = await Promise.all([
    getUserIdsPromise,
    getProductEntryIdsPromise,
  ]);

  let ordersMade = 0;
  let firstLoop = 0;
  let secondLoop = 0;

  while (ordersMade < n) {
    firstLoop += 1;
    console.log(`First loop ran ${firstLoop}`);
    const chosenRandomUserId =
      userIds[genRandomInt(0, userIds.length - 1)]!.userId;

    await db.transaction(async (tx1) => {
      const usersCart = await tx1.query.carts.findFirst({
        where: eq(carts.userId, chosenRandomUserId),
      });

      let cartId = usersCart?.id;

      if (usersCart === undefined) {
        const date = faker.date.past({ years: 1 });
        const returnedCart = await tx1
          .insert(carts)
          .values({
            userId: chosenRandomUserId,
            createdAt: date,
            updatedAt: date,
          })
          .returning();
        cartId = returnedCart[0]!.id;
      }

      if (cartId === undefined) {
        tx1.rollback();
        return;
      }

      const targetCartItemsCount = genRandomInt(3, 9);

      let currentCartItemsCount = 0;
      console.log(targetCartItemsCount, 'Target Items Count');

      while (currentCartItemsCount < targetCartItemsCount) {
        secondLoop += 1;
        console.log(`Second loop ran ${secondLoop}`);

        const randomProductEntryId =
          productEntryIds[genRandomInt(0, productEntryIds.length - 1)]!
            .productEntryId;
        const randomQuantity = genRandomInt(4, 10);

        const stockQuantity = (
          await tx1.query.productEntries.findFirst({
            columns: {
              quantity: true,
            },
            where: eq(productEntries.id, randomProductEntryId),
          })
        )?.quantity;

        if (!stockQuantity || stockQuantity < randomQuantity) {
          tx1.rollback();
          continue;
        }

        const cartItemAlreadyExists =
          (await tx1.query.cartItems.findFirst({
            where: and(
              eq(cartItems.cartId, cartId),
              eq(cartItems.productEntryId, randomProductEntryId),
            ),
          })) !== undefined;

        if (cartItemAlreadyExists) {
          await tx1
            .update(cartItems)
            .set({
              quantity: randomQuantity,
              updatedAt: new Date(),
            })
            .where(
              and(
                eq(cartItems.cartId, cartId),
                eq(cartItems.productEntryId, randomProductEntryId),
              ),
            );
        } else {
          await tx1.insert(cartItems).values({
            cartId,
            productEntryId: randomProductEntryId,
            quantity: randomQuantity,
          });
        }
        currentCartItemsCount += 1;
      }
      secondLoop = 0;

      const date = new Date();
      const orderId = (
        await tx1
          .insert(orders)
          .values({
            userId: chosenRandomUserId,
            createdAt: date,
            updatedAt: date,
          })
          .returning()
      )?.at(0)?.id;

      if (!orderId) {
        tx1.rollback();
        return;
      }

      const cartItemsProps = await tx1
        .select({
          productEntryId: productEntries.id,
          stockQuantity: productEntries.quantity,
          orderQuantity: cartItems.quantity,
          price: products.price,
        })
        .from(cartItems)
        .innerJoin(
          productEntries,
          eq(productEntries.id, cartItems.productEntryId),
        )
        .innerJoin(products, eq(products.id, productEntries.productID))
        .where(eq(cartItems.cartId, cartId));

      // console.log(cartItemsProps, 'cartItemProps');

      // tx1.rollback();
      // return;

      const promises: Promise<unknown>[] = [];

      for (let carItemProp of cartItemsProps) {
        console.log(carItemProp.productEntryId, 'productID');
        console.log(carItemProp.stockQuantity, 'stock');
        if (carItemProp.stockQuantity < carItemProp.orderQuantity) {
          tx1.rollback();
          return;
        }

        const inputOrder = tx1.insert(orderLine).values({
          orderId,
          pricePerUnit: carItemProp.price,
          productEntryId: carItemProp.productEntryId,
          quantity: carItemProp.orderQuantity,
          createdAt: date,
          updatedAt: date,
        });

        const updateStock = tx1
          .update(productEntries)
          .set({
            quantity: carItemProp.stockQuantity - carItemProp.orderQuantity,
            updatedAt: date,
          })
          .where(eq(productEntries.id, carItemProp.productEntryId));

        promises.push(inputOrder, updateStock);
      }

      const deleteCartItems = tx1
        .delete(cartItems)
        .where(eq(cartItems.cartId, cartId));

      promises.push(deleteCartItems);

      await Promise.all(promises);

      ordersMade += 1;
    });
  }
};

const postFakeReviews = async () => {
  const orderLines = await db
    .select({ id: orderLine.id, date: orderLine.updatedAt })
    .from(orderLine);

  const generatedReviews: UserReviewsInsert[] = orderLines.map((orderLine) => ({
    orderLineId: orderLine.id,
    createdAt: orderLine.date,
    updatedAt: orderLine.date,
    rating: (genRandomInt(6, 10) / 2).toString(),
    comment: faker.lorem.paragraph(5),
  }));

  const promises: Promise<unknown>[] = [];

  for (let i = 0; i < generatedReviews.length; i += 1000) {
    promises.push(
      db
        .insert(userReviews)
        .values(
          generatedReviews.slice(
            i,
            Math.min(i + 1000, generatedReviews.length - 1),
          ),
        ),
    );
  }

  await Promise.all(promises);
};

async function execute() {
  console.log('⏳ Running ...');

  const start = performance.now();

  const lol = { name: 'xd', id: 10, createdAt: new Date() };

  const serialized = JSON.parse(JSON.stringify(lol));
  serialized.createdAt = new Date(serialized.createdAt);

  console.log(lol, 'SOURCE');
  console.log(serialized, 'JSON SERIALIZED');

  const end = performance.now();

  console.log(`✅ Completed in ${end - start}ms`);

  process.exit(0);
}

execute().catch((err) => {
  console.error('❌ Task failed');
  console.error(err);
  process.exit(1);
});
