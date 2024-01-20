import {
  InferColumnsDataTypes,
  SQL,
  and,
  between,
  eq,
  getTableColumns,
  inArray,
  isNull,
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
import { ProductEntryInsert, productEntries } from './schema/productEntries';
import { genRandomInt, wait } from '../util';
import { CartsInsert, CartsSelect, carts } from './schema/carts';
import { CartItemsInsert, cartItems } from './schema/cartItems';
import { OrderInsert, orders } from './schema/orders';
import { OrderLinesInsert, orderLine } from './schema/orderLine';
import { UserReviewsInsert, userReviews } from './schema/userReviews';
import {
  DummyUserInsert,
  DummyUserSelect,
  dummyUser,
} from './schema/dummyUser';
import {
  OrderDetailsInsert,
  orderDetails,
  orderStatus,
} from './schema/orderDetails';
import { address } from './schema/address';

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

  const inputProductEntries: ProductEntryInsert[] = entryProductAndSizeID.map(
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

const populateDummyUsers = async (n: number) => {
  const randomlyGeneratedUsers: DummyUserInsert[] = [...Array(n).keys()].map(
    () => {
      const generatedUser: DummyUserInsert = {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        image: faker.image.avatar(),
      };

      return generatedUser;
    },
  );

  await db.insert(dummyUser).values(randomlyGeneratedUsers);
};

// const populateCarts = async (n: number) => {
//   const userIdArr = await db
//     .select({
//       userId: users.id,
//     })
//     .from(users);

//   const alreadyExistingCartsUserIdArr = await db
//     .select({
//       userId: carts.userId,
//     })
//     .from(carts);

//   const selectedUsersIndex: number[] = [];

//   while (selectedUsersIndex.length < n) {
//     const randomIndex = genRandomInt(0, userIdArr.length - 1);

//     if (selectedUsersIndex.findIndex((val) => val === randomIndex) !== -1)
//       continue;

//     if (
//       alreadyExistingCartsUserIdArr.some(
//         (val) => val.userId === userIdArr[randomIndex]!.userId,
//       )
//     )
//       continue;

//     selectedUsersIndex.push(randomIndex);
//   }

//   const generatedCarts: CartsInsert[] = selectedUsersIndex.map((val) => {
//     const date = faker.date.past({ years: 1 });
//     return {
//       userId: userIdArr.at(val)?.userId || 0,
//       createdAt: date,
//       updatedAt: date,
//     };
//   });

//   await db.insert(carts).values(generatedCarts);
// };

// const populateCartItems = async (n: number) => {
//   const productEntryIdArray = await db
//     .select({
//       productEntryId: productEntries.id,
//     })
//     .from(productEntries);

//   const cartIdArray = await db
//     .select({
//       cartId: carts.id,
//     })
//     .from(carts);

//   const cartItemsArray = await db
//     .select({
//       cartId: cartItems.cartId,
//       productEntryID: cartItems.productEntryId,
//     })
//     .from(cartItems);

//   const combinations: [number, number][] = [];

//   while (combinations.length < n) {
//     const selectedCombination = [
//       productEntryIdArray[genRandomInt(0, productEntryIdArray.length - 1)]!
//         .productEntryId,
//       cartIdArray[genRandomInt(0, cartIdArray.length - 1)]!.cartId,
//     ];

//     if (
//       combinations.some(
//         (arr: [number, number]) =>
//           arr.at(0) === selectedCombination.at(0) &&
//           arr.at(1) === selectedCombination.at(1),
//       )
//     )
//       continue;

//     if (
//       cartItemsArray.some((item) => {
//         item.productEntryID === selectedCombination.at(0) &&
//           item.cartId === selectedCombination.at(1);
//       })
//     )
//       continue;

//     combinations.push(selectedCombination as [number, number]);
//   }

//   const generatedCartItems: CartItemsInsert[] = combinations.map(
//     ([productEntryId, cartId]) => {
//       const date = faker.date.recent();
//       return {
//         cartId,
//         productEntryId,
//         // quantity: genRandomInt(200, 800),
//         quantity: 200,
//         createdAt: date,
//         updatedAt: date,
//       };
//     },
//   );

//   const promises: Promise<void>[] = [];

//   for (let i = 0; i < generatedCartItems.length; i++) {
//     const cartItem = generatedCartItems.at(i);

//     if (cartItem === undefined) continue;

//     const cartItemTransactionPromise = db.transaction(async (tx1) => {
//       const res = await tx1
//         .select({
//           quantity: productEntries.quantity,
//         })
//         .from(productEntries)
//         .where(eq(productEntries.id, cartItem.productEntryId));

//       const inventoryQuantity = res.at(0)?.quantity || 0;

//       if (inventoryQuantity < cartItem.quantity) {
//         await tx1.rollback();
//         return;
//       }

//       await tx1.insert(cartItems).values(cartItem);
//     });

//     promises.push(cartItemTransactionPromise);
//   }

//   await Promise.allSettled(promises);

//   // await db.insert(cartItems).values(generatedCartItems);
// };

const makeRandomDummyOrders = async (n: number) => {
  const getUserIdsPromise = db
    .select({
      userId: dummyUser.id,
    })
    .from(dummyUser);

  const getProductEntriesPromise = db
    .select({
      productEntryId: productEntries.id,
      stockQuantity: productEntries.quantity,
      price: products.price,
    })
    .from(productEntries)
    .innerJoin(products, eq(products.id, productEntries.productID));

  const [userIds, productEntriesData] = await Promise.all([
    getUserIdsPromise,
    getProductEntriesPromise,
  ]);

  let ordersMade = 0;

  const chosenUserIds: DummyUserSelect['id'][] = [];

  while (chosenUserIds.length <= n) {
    const chosenRandomUserId =
      userIds[genRandomInt(0, userIds.length - 1)]!.userId;
    chosenUserIds.push(chosenRandomUserId);
  }

  await db.transaction(async (tx1) => {
    const newOrdersData: Partial<OrderInsert>[] = chosenUserIds.map((id) => ({
      dummyUserId: id,
    }));
    const newOrders = await tx1
      .insert(orders)
      .values(newOrdersData)
      .returning();

    for (let chosenRandomUserId of chosenUserIds) {
      const date = faker.date.past({ years: 3 });

      const newOrder = newOrders.find(
        (order) => order.dummyUserId === chosenRandomUserId,
      );

      if (!newOrder) {
        tx1.rollback();
        return;
      }

      const newOrderId = newOrder.id;

      const targetOrderLineCount = genRandomInt(3, 9);

      let currentOrderLineCount = 0;

      const promises: Promise<unknown>[] = [];

      while (currentOrderLineCount < targetOrderLineCount) {
        const randomProductEntry =
          productEntriesData[genRandomInt(0, productEntriesData.length - 1)]!;
        const randomProductEntryId = randomProductEntry.productEntryId;

        const randomQuantity = genRandomInt(4, 10);

        if (
          !randomProductEntry.stockQuantity ||
          randomProductEntry.stockQuantity < randomQuantity
        ) {
          tx1.rollback();
          continue;
        }

        if (randomQuantity > randomProductEntry.stockQuantity) {
          tx1.rollback();
          continue;
        }
        const insertOrderLinePromise = tx1
          .insert(orderLine)
          .values({
            orderId: newOrderId,
            productEntryId: randomProductEntryId,
            quantity: randomQuantity,
            pricePerUnit: randomProductEntry.price,
          })
          .onConflictDoNothing();

        const updateStockPromise = tx1
          .update(productEntries)
          .set({
            quantity: randomProductEntry.stockQuantity - randomQuantity,
            updatedAt: date,
          })
          .where(eq(productEntries.id, randomProductEntryId));
        promises.push(insertOrderLinePromise, updateStockPromise);

        currentOrderLineCount += 1;
      }

      await Promise.all(promises);

      ordersMade += 1;
    }
  });
};

const postFakeReviews = async (n: number = 1000) => {
  const allOrderLines = await db
    .select({ id: orderLine.id, date: orderLine.updatedAt })
    .from(orderLine)
    .leftJoin(userReviews, eq(orderLine.id, userReviews.orderLineId))
    .where(isNull(userReviews.orderLineId));

  const selectedOrderLines: typeof allOrderLines = [];

  for (let i = 0; i < n; i++) {
    const selectedOrderLine = allOrderLines.at(
      genRandomInt(0, allOrderLines.length - 1),
    );
    if (
      selectedOrderLine?.id &&
      !selectedOrderLines.find((x) => x.id === selectedOrderLine.id)
    ) {
      selectedOrderLines.push(selectedOrderLine);
    }
  }

  const generatedReviews: UserReviewsInsert[] = selectedOrderLines.map(
    (orderLine) => ({
      orderLineId: orderLine.id,
      createdAt: orderLine.date,
      updatedAt: orderLine.date,
      rating: (genRandomInt(6, 10) / 2).toString(),
      comment: faker.lorem.paragraph(5),
    }),
  );

  await db.transaction(async (tx) => {
    await tx.insert(userReviews).values(generatedReviews).onConflictDoNothing();
  });
};

const populateOrderStatusText = async () => {
  await db
    .insert(orderStatus)
    .values([
      { text: 'processing' },
      { text: 'confirmed' },
      { text: 'out for delivery' },
      { text: 'delivered' },
      { text: 'cancelled' },
      { text: 'returned' },
    ]);
};

const populateOrderDates = async () => {
  const allOrders = await db.select().from(orders);

  const updatedOrdersData = allOrders.map((order) => ({
    id: order.id,
    date: faker.date.past({ years: 3 }),
  }));

  const promises: Promise<unknown>[] = [];

  for (let order of updatedOrdersData) {
    const orderPromise = db
      .update(orders)
      .set({ createdAt: order.date, updatedAt: new Date() })
      .where(eq(orders.id, order.id));

    promises.push(orderPromise);
  }

  await Promise.all(promises);
};

const populateOrderDetails = async () => {
  const allOrders = await db.select().from(orders);

  const orderDetailsInsertPromise: Promise<unknown>[] = [];

  for (let order of allOrders) {
    if (!order.createdAt) continue;

    const deliveryDate = new Date(order.createdAt);
    deliveryDate.setDate(order.createdAt.getDate() + 2);

    const deliveredAt = new Date(deliveryDate);
    deliveredAt.setHours(deliveredAt.getHours() - genRandomInt(1, 6));

    const orderDetailsInsert: OrderDetailsInsert = {
      orderId: order.id,
      placedAt: order.createdAt,
      deliveryDate,
      deliveredAt,
      statusId: 4,
      updatedAt: new Date(),
    };

    orderDetailsInsertPromise.push(
      db.insert(orderDetails).values(orderDetailsInsert).onConflictDoNothing(),
    );
  }

  await Promise.all(orderDetailsInsertPromise);
};

async function execute() {
  console.log('⏳ Running ...');

  const start = performance.now();

  const end = performance.now();

  console.log(`✅ Completed in ${end - start}ms`);

  process.exit(0);
}

execute().catch((err) => {
  console.error('❌ Task failed');
  console.error(err);
  process.exit(1);
});
