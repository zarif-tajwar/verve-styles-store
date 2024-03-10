import { SQL, sql } from 'drizzle-orm';
import { cache } from 'react';
import 'server-only';
import { db } from '../db';
import { SearchParamsServer } from '../types/common';
import { UserOrder } from '../types/user';
import { GetOrdersSchema } from '../validation/orders';
import { auth } from './auth';

export const getOrdersServer = cache(
  async ({ searchParams }: { searchParams: SearchParamsServer }) => {
    const { user } = await auth();

    if (!user) return null;

    const parseSearchParams = GetOrdersSchema.safeParse(searchParams);

    if (!parseSearchParams.success) return [];

    console.log(parseSearchParams.data, 'INPUT ORDER GETTER PARAMS');

    const { status, page, orderDateRange } = parseSearchParams.data;

    let query = sql`
  SELECT
    o.id AS "orderId",
    order_lines.data AS "orderedProducts",
    od.placed_at AS "orderDate",
    od.delivery_date AS "deliveryDate",
    od."deliveredAt" AS "deliveredAt",
    os.text AS "status"
  FROM
    orders o
    LEFT JOIN order_details od ON od.order_id = o.id
    LEFT JOIN order_status os ON os.id = od.status_id
    LEFT JOIN LATERAL (
      SELECT
        JSON_AGG (
          JSON_BUILD_OBJECT (
            'quantity',
            ol.quantity,
            'total',
            ROUND(
              ol.price_per_unit * ol.quantity * (1 - ol.discount / 100),
              2
            ),
            'name',
            pr.name,
            'image',
            pimg.url,
            'size',
            s.name
          )
        ) AS data
      FROM
        order_line ol
        INNER JOIN product_entries pe ON pe.id = ol.product_entry_id
        INNER JOIN products pr ON pr.id = pe.product_id
        INNER JOIN sizes s ON s.id = pe.size_id
        INNER JOIN product_images pimg ON pimg.product_id = pr.id
      WHERE
        ol.order_id = o.id
        AND
        pimg.is_default = TRUE
    ) AS order_lines ON TRUE
  WHERE
  `;

    const conditionals: SQL[] = [];

    conditionals.push(sql`o.user_id = ${user.id}`);

    if (status) {
      if (
        ['delivered', 'cancelled', 'returned'].findIndex(
          (v) => v === status,
        ) !== -1
      ) {
        conditionals.push(sql`os.text = ${status}`);
      } else if (status === 'ongoing') {
        conditionals.push(
          sql`os.text IN ('processing','confirmed','out for delivery')`,
        );
      }
    }

    if (orderDateRange) {
      if (orderDateRange.from && orderDateRange.to) {
        conditionals.push(
          sql`DATE(od.placed_at) BETWEEN ${orderDateRange.from} AND ${orderDateRange.to}`,
        );
      }
      if (orderDateRange.from && !orderDateRange.to) {
        conditionals.push(
          sql`DATE(od.placed_at) = DATE(${orderDateRange.from}::timestamp)`,
        );
      }
    }

    query.append(sql.join(conditionals, sql.raw(' and ')));

    query.append(sql` ORDER BY od.placed_at DESC`);
    query.append(sql` LIMIT 4`);

    if (page > 1) {
      query.append(sql` OFFSET ${4 * (page - 1)}`);
    }

    const res = await db.execute(query);

    const ordersData = res.rows as UserOrder[];

    return ordersData;
  },
);

// export const generateRandomCompletedOrders = async (
//   userId: UserSelect['id'] | DummyUserSelect['id'],
//   isDummyUser: boolean = false,
//   orderNumber = 10,
// ) => {
//   const allProductEntries = await db
//     .select({
//       productEntryId: productEntries.id,
//       stockQuantity: productEntries.quantity,
//       price: products.price,
//       discount: products.discount,
//     })
//     .from(productEntries)
//     .innerJoin(products, eq(products.id, productEntries.productID))
//     .where(gt(productEntries.quantity, 10));

//   for (let i = 0; i < orderNumber; i++) {
//     const date = faker.date.past({ years: 3 });

//     const deliveryDate = new Date(date);
//     deliveryDate.setDate(date.getDate() + 2);

//     const deliveredAt = new Date(deliveryDate);
//     deliveredAt.setHours(deliveredAt.getHours() - genRandomInt(1, 6));

//     const orderInsertData: OrderInsert = {
//       ...(isDummyUser ? { dummyUserId: userId } : { userId: userId }),
//       createdAt: date,
//     };

//     const getOrderDetailsInsertData = (
//       orderId: OrderDetailsInsert['orderId'],
//     ): OrderDetailsInsert => ({
//       orderId,
//       deliveredAt,
//       deliveryDate,
//       placedAt: date,
//       statusId: 4,
//     });

//     const getOrderLinesInsertData = (
//       orderId: OrderLinesInsert['orderId'],
//     ): OrderLinesInsert[] =>
//       [...Array(genRandomInt(2, 8)).keys()].map(() => {
//         const chosenProductEntry =
//           allProductEntries[genRandomInt(0, allProductEntries.length - 1)]!;
//         return {
//           orderId,
//           pricePerUnit: chosenProductEntry.price,
//           productEntryId: chosenProductEntry.productEntryId,
//           quantity: genRandomInt(1, 10),
//           discount: chosenProductEntry.discount,
//           createdAt: date,
//         };
//       });

//     const getStockQuantityUpdateData = (orderLinesData: OrderLinesInsert[]) => {
//       return orderLinesData.map((orderLine) => ({
//         productEntryId: orderLine.productEntryId,
//         quantity: orderLine.quantity,
//       }));
//     };

//     await db.transaction(async (tx) => {
//       const newOrder = (
//         await tx.insert(orders).values(orderInsertData).returning()
//       ).at(0);

//       if (!newOrder) {
//         tx.rollback();
//         return;
//       }

//       const orderLinesData = await tx
//         .insert(orderLine)
//         .values(getOrderLinesInsertData(newOrder.id))
//         .returning();

//       if (orderLinesData.length === 0) {
//         tx.rollback();
//         return;
//       }

//       const stockQuantityUpdateData =
//         getStockQuantityUpdateData(orderLinesData);

//       const dbPromises: Promise<unknown>[] = [];

//       for (let data of stockQuantityUpdateData) {
//         const sq = tx
//           .select({
//             quantity: sql<number>`${productEntries.quantity} - ${data.quantity}`,
//           })
//           .from(productEntries)
//           .where(eq(productEntries.id, data.productEntryId));
//         dbPromises.push(
//           tx
//             .update(productEntries)
//             .set({ quantity: sql<number>`${sq}` })
//             .where(eq(productEntries.id, data.productEntryId)),
//         );
//       }

//       const orderDetailsData = tx
//         .insert(orderDetails)
//         .values(getOrderDetailsInsertData(newOrder.id))
//         .returning();

//       dbPromises.push(orderDetailsData);

//       await Promise.all(dbPromises);
//     });
//   }
// };
