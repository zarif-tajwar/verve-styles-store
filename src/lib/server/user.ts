// import 'server-only';
import { UserSelect, user } from '../db/schema/auth';
import { DummyUserSelect, dummyUser } from '../db/schema/dummyUser';
import { db } from '../db';
import { OrderInsert, orders } from '../db/schema/orders';
import {
  OrderDetailsInsert,
  orderDetails,
  orderStatus,
} from '../db/schema/orderDetails';
import { desc, eq, gt, sql } from 'drizzle-orm';
import { OrderLinesInsert, orderLine } from '../db/schema/orderLine';
import { productEntries } from '../db/schema/productEntries';
import { products } from '../db/schema/products';
import { genRandomInt } from '../util';
import { faker } from '@faker-js/faker';

export const getOrdersServer = async (
  userId: UserSelect['id'] | DummyUserSelect['id'],
  isDummyUser: boolean = false,
) => {
  let query = db
    .select({
      orderId: orders.id,
      status: orderStatus.text,
      orderDate: orderDetails.placedAt,
      deliveredAt: orderDetails.deliveredAt,
      // totalPrice:
      //   sql<number>`SUM(${orderLine.pricePerUnit}*${orderLine.quantity})`.as(
      //     'total_price',
      //   ),
    })
    .from(orders)
    .innerJoin(orderDetails, eq(orderDetails.orderId, orders.id))
    .innerJoin(orderStatus, eq(orderStatus.id, orderDetails.statusId))
    // .innerJoin(orderLine, eq(orderLine.orderId, orders.id))
    .$dynamic();

  if (isDummyUser) {
    query
      .innerJoin(dummyUser, eq(dummyUser.id, orders.dummyUserId))
      .where(eq(dummyUser.id, userId));
  } else {
    query
      .innerJoin(user, eq(user.id, orders.userId))
      .where(eq(user.id, userId));
  }

  const ordersData = await query
    // .groupBy(orders.id, orderStatus.text)
    .orderBy(desc(orderDetails.placedAt))
    .limit(5);

  return ordersData;
};

export const generateRandomCompletedOrders = async (
  userId: UserSelect['id'] | DummyUserSelect['id'],
  isDummyUser: boolean = false,
  orderNumber = 10,
) => {
  const allProductEntries = await db
    .select({
      productEntryId: productEntries.id,
      stockQuantity: productEntries.quantity,
      price: products.price,
      discount: products.discount,
    })
    .from(productEntries)
    .innerJoin(products, eq(products.id, productEntries.productID))
    .where(gt(productEntries.quantity, 10));

  for (let i = 0; i < orderNumber; i++) {
    const date = faker.date.past({ years: 3 });

    const deliveryDate = new Date(date);
    deliveryDate.setDate(date.getDate() + 2);

    const deliveredAt = new Date(deliveryDate);
    deliveredAt.setHours(deliveredAt.getHours() - genRandomInt(1, 6));

    const orderInsertData: OrderInsert = {
      ...(isDummyUser ? { dummyUserId: userId } : { userId: userId }),
      createdAt: date,
    };

    const getOrderDetailsInsertData = (
      orderId: OrderDetailsInsert['orderId'],
    ): OrderDetailsInsert => ({
      orderId,
      deliveredAt,
      deliveryDate,
      placedAt: date,
      statusId: 4,
    });

    const getOrderLinesInsertData = (
      orderId: OrderLinesInsert['orderId'],
    ): OrderLinesInsert[] =>
      [...Array(genRandomInt(2, 8)).keys()].map(() => {
        const chosenProductEntry =
          allProductEntries[genRandomInt(0, allProductEntries.length - 1)]!;
        return {
          orderId,
          pricePerUnit: chosenProductEntry.price,
          productEntryId: chosenProductEntry.productEntryId,
          quantity: genRandomInt(1, 10),
          discount: chosenProductEntry.discount,
          createdAt: date,
        };
      });

    const getStockQuantityUpdateData = (orderLinesData: OrderLinesInsert[]) => {
      return orderLinesData.map((orderLine) => ({
        productEntryId: orderLine.productEntryId,
        quantity: orderLine.quantity,
      }));
    };

    await db.transaction(async (tx) => {
      const newOrder = (
        await tx.insert(orders).values(orderInsertData).returning()
      ).at(0);

      if (!newOrder) {
        tx.rollback();
        return;
      }

      const orderLinesData = await tx
        .insert(orderLine)
        .values(getOrderLinesInsertData(newOrder.id))
        .returning();

      if (orderLinesData.length === 0) {
        tx.rollback();
        return;
      }

      const stockQuantityUpdateData =
        getStockQuantityUpdateData(orderLinesData);

      const dbPromises: Promise<unknown>[] = [];

      for (let data of stockQuantityUpdateData) {
        const sq = tx
          .select({
            quantity: sql<number>`${productEntries.quantity} - ${data.quantity}`,
          })
          .from(productEntries)
          .where(eq(productEntries.id, data.productEntryId));
        dbPromises.push(
          tx
            .update(productEntries)
            .set({ quantity: sql<number>`${sq}` })
            .where(eq(productEntries.id, data.productEntryId)),
        );
      }

      const orderDetailsData = tx
        .insert(orderDetails)
        .values(getOrderDetailsInsertData(newOrder.id))
        .returning();

      dbPromises.push(orderDetailsData);

      await Promise.all(dbPromises);
    });
  }
};
