// import 'server-only';
import { UserSelect, user } from '../db/schema/auth';
import { DummyUserSelect, dummyUser } from '../db/schema/dummyUser';
import { db } from '../db';
import { orders } from '../db/schema/orders';
import { orderDetails, orderStatus } from '../db/schema/orderDetails';
import { eq, sql } from 'drizzle-orm';
import { orderLine } from '../db/schema/orderLine';

export const getOrdersServer = async (
  userId: UserSelect['id'] | DummyUserSelect['id'],
  isDummyUser: boolean = false,
) => {
  let query = db
    .select({
      orderId: orders.id,
      status: orderStatus.text,
      orderDate: orderDetails.placedAt,
      //   totalPrice:
      //     sql<number>`SUM(${orderLine.pricePerUnit}*${orderLine.quantity})`.as(
      //       'total_price',
      //     ),
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
    .orderBy(orderDetails.placedAt);

  console.log(ordersData.length, 'ORDERS');

  return ordersData;
};
