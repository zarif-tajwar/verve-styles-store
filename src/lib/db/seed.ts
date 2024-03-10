import { faker } from '@faker-js/faker';
import {
  rand,
  randAddress,
  randEmail,
  randFirstName,
  randLastName,
  randPastDate,
  randPhoneNumber,
  randText,
} from '@ngneat/falso';
import crypto from 'crypto';
import { SQL, and, eq, inArray, isNull, sql } from 'drizzle-orm';
import { QueryBuilder } from 'drizzle-orm/pg-core';
import * as fs from 'fs';
import { ulid } from 'ulidx';
import {
  EdgeStoreClientResponse,
  edgeStoreBackendClient,
} from '../server/edgestore';
import { genRandomInt } from '../util';
import { db } from './index';
import { AddressInsert, address } from './schema/address';
import { UserInsert, UserSelect, user } from './schema/auth2';
import { clothing } from './schema/clothing';
import { dressStyles } from './schema/dressStyles';
import {
  DummyUserInsert,
  DummyUserSelect,
  dummyUser,
} from './schema/dummyUser';
import { EdgeStoreImagesInsert, edgeStoreImages } from './schema/edgeStore';
import { InvoiceInsert, invoice } from './schema/invoice';
import {
  OrderCustomerDetailsInsert,
  orderCustomerDetails,
} from './schema/orderCustomerDetails';
import {
  OrderDetailsInsert,
  orderDetails,
  orderStatus,
} from './schema/orderDetails';
import { OrderLinesInsert, orderLine } from './schema/orderLine';
import {
  OrderPaymentDetailsInsert,
  orderPaymentDetails,
} from './schema/orderPaymentDetails';
import { OrderInsert, orders } from './schema/orders';
import { ProductEntryInsert, productEntries } from './schema/productEntries';
import { ProductImagesInsert, productImages } from './schema/productImages';
import { products } from './schema/products';
import { sizes } from './schema/sizes';
import { UserReviewsInsert, userReviews } from './schema/userReviews';

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

const updateStockQuantityTest = async () => {
  const qb = new QueryBuilder();

  const rows = [
    { id: 1, decrementBy: 5 },
    { id: 2, decrementBy: 10 },
    { id: 3, decrementBy: 15 },
    { id: 4, decrementBy: 20 },
    { id: 5, decrementBy: 25 },
  ];

  const targetColumnValues = [];
  const sqlChunks: SQL[] = [];

  sqlChunks.push(sql`(case`);
  for (const row of rows) {
    targetColumnValues.push(row.id);
    sqlChunks.push(
      // sql`when id = ${row.id} then 500`,
      // sql`when id = ${
      //   row.id
      // } then ${sql`(select (${productEntries.quantity} - ${row.decrementBy}) from ${productEntries} where ${productEntries.id} = ${row.id})`}`,
      sql`when ${productEntries.id} = ${row.id} then (${qb
        .select({
          quantity: sql<number>`${productEntries.quantity} - ${row.decrementBy}`,
        })
        .from(productEntries)
        .where(eq(productEntries.id, row.id))})`,
    );
  }
  sqlChunks.push(sql`end)`);

  const finalSql = sql.join(sqlChunks, sql.raw(' '));

  const res = await db
    .update(productEntries)
    .set({ quantity: finalSql })
    .where(inArray(productEntries.id, targetColumnValues))
    .returning();
  // .toSQL();

  console.log(res);
  // console.log(res.sql);

  return res;
};

const uploadPicsTemp = async () => {
  const files = await fs.readdirSync(
    'C:\\Users\\katalist\\Desktop\\verve-images\\platzi\\tshirts',
    { withFileTypes: true },
  );
  const imagesData = files.map((file) => {
    const imagePath = `${file.path}\\${file.name}`;
    const fileBuffer = fs.readFileSync(imagePath);
    const blob = new Blob([fileBuffer], { type: 'image/jpeg' });
    // const fileObj = new File([blob], file.name, { type: 'image/jpeg' });
    return {
      blob,
      name: file.name,
    };
  });
  const responses: EdgeStoreClientResponse['publicFiles']['upload'][] = [];
  const promises: Promise<EdgeStoreClientResponse['publicFiles']['upload']>[] =
    [];

  for (let i = 0; i < imagesData.length; i++) {
    const data = imagesData[i]!;
    const promise = edgeStoreBackendClient.publicFiles.upload({
      content: {
        blob: data.blob,
        extension: 'jpeg',
      },
      options: {
        temporary: false,
      },
      input: { attribute: 'Platzi (fakestore api)', clothing: 'tshirts' },
    });
    promises.push(promise);
  }

  const data = await Promise.all(promises);

  const dataInsert: EdgeStoreImagesInsert[] = data.map((x) => ({
    url: x.url,
    size: x.size,
    attribute: x.metadata.attribute,
    clothing: x.metadata.clothing,
  }));

  const dbInsertedData = await db
    .insert(edgeStoreImages)
    .values(dataInsert)
    .returning();

  console.log(JSON.stringify(dbInsertedData));
};

const populateProductImages = async () => {
  const [productData, edgeStoreImagesData] = await Promise.all([
    db
      .selectDistinct({ productId: products.id, clothing: clothing.name })
      .from(products)
      .innerJoin(clothing, eq(products.clothingID, clothing.id)),
    db.select().from(edgeStoreImages),
  ]);

  const productImagesInsertData: ProductImagesInsert[] = [];

  let productPopulated = 0;
  let productImageInsertCreated = 0;

  for (let i = 0; i < productData.length; i++) {
    const selectedProduct = productData.at(i)!;
    const filteredEdgeStoreImages = edgeStoreImagesData.filter(
      (imgData) => imgData.clothing === selectedProduct.clothing,
    );
    for (let j = 0; j < 3; j++) {
      const selectedEdgeStoreImage = rand(filteredEdgeStoreImages);
      productImagesInsertData.push({
        productID: selectedProduct.productId,
        url: selectedEdgeStoreImage.url,
        size: selectedEdgeStoreImage.size,
        isDefault: j === 0,
      });
      productImageInsertCreated += 1;
    }
    productPopulated += 1;
  }

  const promises: Promise<unknown>[] = [];

  for (let i = 0; i < productImagesInsertData.length; i = i + 10000) {
    const dataChunk = productImagesInsertData.slice(
      i,
      Math.min(i + 10000, productImagesInsertData.length - 1),
    );
    promises.push(db.insert(productImages).values(dataChunk));
  }

  await Promise.all(promises);
};

const insertSomeTestUsers = async (n: number) => {
  const insertData: UserInsert[] = [...Array(n).keys()].map(() => {
    const firstName = randFirstName({ withAccents: false });
    const lastName = randLastName({ withAccents: false });
    return {
      id: ulid(),
      email: randEmail({ firstName, lastName }),
      name: `${firstName} ${lastName}`,
      role: 'TEST_USER',
      emailVerified: null,
      image: faker.image.avatarGitHub(),
    };
  });
  return await db.transaction(async (tx) => {
    return await tx.insert(user).values(insertData).returning();
  });
};

const deleteAllTestUsers = async () => {
  return await db.transaction(async (tx) => {
    await tx.delete(user).where(eq(user.role, 'TEST_USER')).returning();
  });
};

const populateTestUserAddresses = async () => {
  const addressInsert: AddressInsert[] = [];
  const testUsers = await db
    .select()
    .from(user)
    .where(eq(user.role, 'TEST_USER'));
  for (let i = 0; i < testUsers.length; i++) {
    for (let j = 0; j < genRandomInt(2, 5); j++) {
      const fakeAddress = randAddress();
      const insertedAddress: AddressInsert = {
        address: fakeAddress.street,
        city: fakeAddress.city,
        country: fakeAddress.country!,
        label: randText({ charCount: 10 }),
        phone: randPhoneNumber({ countryCode: 'UK' }),
        isSaved: true,
        userId: testUsers.at(i)!.id,
        type: rand(['home', 'not-relevant', 'office']),
        isDefault: j === 0,
      };
      addressInsert.push(insertedAddress);
    }
  }

  await db.insert(address).values(addressInsert);
};

const populateTestUserOrders = async () => {
  const testUsersPromise = db
    .select()
    .from(user)
    .innerJoin(address, eq(user.id, address.userId))
    .where(and(eq(user.role, 'TEST_USER'), eq(address.isDefault, true)));

  const productEntriesPromise = db.select().from(productEntries);

  const [testUsersData, productEntriesData] = await Promise.all([
    testUsersPromise,
    productEntriesPromise,
  ]);

  const promises: Promise<unknown>[] = [];

  for (let i = 0; i < testUsersData.length; i++) {
    const selectedUser = testUsersData.at(i)!;
    const howManyOrdersShouldBeMade = genRandomInt(20, 30);
    for (let j = 0; j < howManyOrdersShouldBeMade; j++) {
      const howManyOrderLines = genRandomInt(3, 8);
    }
  }
};

const makeRandomFakeOrdersByUser = async ({
  id,
  isDummyUser,
}: {
  id: UserSelect['id'] | DummyUserSelect['id'];
  isDummyUser?: boolean;
}) => {
  const userSelectPromise = isDummyUser
    ? db
        .select()
        .from(dummyUser)
        .where(eq(dummyUser.id, id))
        .then((res) => res.at(0))
    : db
        .select()
        .from(user)
        .where(eq(user.id, id))
        .then((res) => res.at(0));

  const productEntriesSelectPromise = db
    .select()
    .from(productEntries)
    .innerJoin(products, eq(productEntries.productID, products.id));

  const [userData, productEntriesData] = await Promise.all([
    userSelectPromise,
    productEntriesSelectPromise,
  ]);

  if (!userData) return;

  const howManyOrdersShouldBeMade = genRandomInt(20, 30);
  const promises: Promise<unknown>[] = [];
  const orderStatusIds = [2, 4, 5, 6];

  for (let i = 0; i < howManyOrdersShouldBeMade; i++) {
    const createOrderPromise = db.transaction(async (tx) => {
      const date = randPastDate({ years: 2 });

      const createdOrder = (
        await tx
          .insert(orders)
          .values({ userId: id, createdAt: date })
          .returning()
      ).at(0);

      if (!createdOrder) {
        tx.rollback();
        return;
      }

      const selectedStatusId = rand(orderStatusIds);

      const estimatedDeliveryDate = new Date(date);
      estimatedDeliveryDate.setDate(date.getDate() + 2);

      const deliveredAt = new Date(date);
      deliveredAt.setDate(date.getDate() + 1);

      const orderDetailsInsertData: OrderDetailsInsert = {
        orderId: createdOrder.id,
        statusId: selectedStatusId,
        placedAt: date,
        deliveryDate: estimatedDeliveryDate,
        deliveredAt: selectedStatusId === 2 ? deliveredAt : null,
      };
      const fakeAddress = randAddress();

      const orderCustomerDetailsInsertData: OrderCustomerDetailsInsert = {
        address: fakeAddress.street,
        city: fakeAddress.city,
        country: fakeAddress.country!,
        addressLabel: randText({ charCount: 10 }),
        phone: randPhoneNumber({ countryCode: 'UK' }),
        addressType: rand(['home', 'not-relevant', 'office']),
        customerName: userData.name!,
        orderId: createdOrder.id,
        customerEmail: userData.email,
        createdAt: date,
      };

      const orderPaymentDetailsData: OrderPaymentDetailsInsert = {
        orderId: createdOrder.id,
        createdAt: date,
        paymentMethod: 'dummy',
      };

      const howManyOrderLines = genRandomInt(4, 8);

      const orderLinesData: OrderLinesInsert[] = [
        ...Array(howManyOrderLines).keys(),
      ].map(() => {
        const selectedProductEntry = rand(productEntriesData);
        return {
          orderId: createdOrder.id,
          pricePerUnit: selectedProductEntry.products.price,
          productEntryId: selectedProductEntry.product_entries.id,
          quantity: genRandomInt(2, 5),
          discount: '0',
        };
      });

      let subtotal = 0;
      let totalDiscount = 0;

      for (let orderLineData of orderLinesData) {
        const sub =
          orderLineData.quantity *
          Number.parseFloat(orderLineData.pricePerUnit);

        subtotal += sub;
        totalDiscount +=
          sub * (Number.parseFloat(orderLineData.discount ?? '0') / 100);
      }

      const invoiceData: InvoiceInsert = {
        deliveryCharge: '25',
        orderId: createdOrder.id,
        subtotal: subtotal.toString(),
        totalDiscountInCurrency: totalDiscount.toString(),
      };

      const promises: Promise<unknown>[] = [];

      promises.push(tx.insert(orderDetails).values(orderDetailsInsertData));
      promises.push(
        tx.insert(orderPaymentDetails).values(orderPaymentDetailsData),
      );
      promises.push(
        tx.insert(orderCustomerDetails).values(orderCustomerDetailsInsertData),
      );
      promises.push(tx.insert(invoice).values(invoiceData));
      promises.push(tx.insert(orderLine).values(orderLinesData));

      await Promise.all(promises);
    });
    promises.push(createOrderPromise);
  }
  await Promise.all(promises);
};

const makeRandomTestUserOrders = async () => {
  const allTestUsers = await db
    .select()
    .from(user)
    .where(eq(user.role, 'TEST_USER'));

  const promises: Promise<unknown>[] = [];

  for (let i = 0; i < allTestUsers.length; i++) {
    // const promisesChunk: Promise<unknown>[] = [];
    // const testUsersChunk = allTestUsers.slice(i, i + 100);
    // for (let j = 0; j < testUsersChunk.length; j++) {
    //   promisesChunk.push(
    //     makeRandomFakeOrdersByUser({ id: testUsersChunk.at(j)!.id }),
    //   );
    // }
    // promises.push();
    // await Promise.all(promisesChunk);
    await makeRandomFakeOrdersByUser({ id: allTestUsers.at(i)!.id });
  }
};

const deleteOrders = async () => {
  await db.transaction(async (tx) => {
    const orderIds = await tx
      .select({ orderId: orders.id })
      .from(orders)
      .innerJoin(user, eq(orders.userId, user.id))
      .where(eq(user.role, 'TEST_USER'))
      .then((orders) => orders.map((order) => order.orderId));

    await tx
      .delete(orderDetails)
      .where(inArray(orderDetails.orderId, orderIds));
    await tx
      .delete(orderPaymentDetails)
      .where(inArray(orderPaymentDetails.orderId, orderIds));
    await tx
      .delete(orderCustomerDetails)
      .where(inArray(orderCustomerDetails.orderId, orderIds));
    await tx.delete(invoice).where(inArray(invoice.orderId, orderIds));
    await tx.delete(orderLine).where(inArray(orderLine.orderId, orderIds));
    await tx.delete(orders).where(inArray(orders.id, orderIds));
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

async function execute() {
  console.log('⏳ Running ...');

  const start = performance.now();

  for (let i = 0; i < 10; i++) {
    await postFakeReviews(10000);
  }

  const end = performance.now();

  console.log(`✅ Completed in ${end - start}ms`);

  process.exit(0);
}

execute().catch((err) => {
  console.error('❌ Task failed');
  console.error(err);
  process.exit(1);
});
