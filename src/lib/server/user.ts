import 'server-only';
import { UserSelect, user } from '../db/schema/auth';
import { DummyUserSelect, dummyUser } from '../db/schema/dummyUser';
import { db } from '../db';
import { OrderInsert, OrderSelect, orders } from '../db/schema/orders';
import {
  OrderDetailsInsert,
  OrderDetailsSelect,
  orderDetails,
  orderStatus,
} from '../db/schema/orderDetails';
import { SQL, and, desc, eq, gt, sql } from 'drizzle-orm';
import { OrderLinesInsert, orderLine } from '../db/schema/orderLine';
import { productEntries } from '../db/schema/productEntries';
import { products } from '../db/schema/products';
import { genRandomInt, wait } from '../util';
import { faker } from '@faker-js/faker';
import { DateRange } from 'react-day-picker';
import { AddressInsert, AddressSelect, address } from '../db/schema/address';
import { auth } from '@/auth';
import {
  AddressFormSchema,
  AddressFormSchemaType,
} from '../validation/address-form';
import { Session } from 'next-auth/types';
import { revalidatePath } from 'next/cache';

type UserOrderedProduct = {
  quantity: number;
  total: number;
  name: string;
  size: string;
};

type UserOrder = {
  orderId: OrderSelect['id'];
  status: string;
  orderDate?: OrderDetailsSelect['placedAt'];
  deliveryDate?: OrderDetailsSelect['deliveryDate'];
  deliveredAt?: OrderDetailsSelect['deliveredAt'];
  orderedProducts: UserOrderedProduct[];
};

export const getOrdersServer = async (
  userId: UserSelect['id'] | DummyUserSelect['id'],
  isDummyUser: boolean = false,
  status: string | undefined,
  orderDateRange: DateRange | undefined,
  page: number,
) => {
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
            'size',
            s.name
          )
        ) AS data
      FROM
        order_line ol
        INNER JOIN product_entries pe ON pe.id = ol.product_entry_id
        INNER JOIN products pr ON pr.id = pe.product_id
        INNER JOIN sizes s ON s.id = pe.size_id
      WHERE
        ol.order_id = o.id
    ) AS order_lines ON TRUE
  WHERE
  `;

  const conditionals: SQL[] = [];

  if (isDummyUser) {
    conditionals.push(sql`o.dummy_user_id = ${userId}`);
  } else {
    conditionals.push(sql`o.user_id = ${userId}`);
  }

  if (status) {
    if (
      ['delivered', 'cancelled', 'returned'].findIndex((v) => v === status) !==
      -1
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

  query.append(sql` ORDER BY od.placed_at`);
  query.append(sql` LIMIT 4`);

  if (page > 1) {
    query.append(sql` OFFSET ${4 * (page - 1)}`);
  }

  const res = await db.execute(query);

  const ordersData = res.rows as UserOrder[];

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

export const addNewAddressServer = async ({
  data,
  session,
}: {
  data: AddressFormSchemaType;
  session?: Session;
}) => {
  const user = session ? session.user : (await auth())?.user;
  if (!user) return;

  const zParse = AddressFormSchema.safeParse(data);

  if (!zParse.success) return;

  let label = zParse.data.label;
  if (!label) {
    if (zParse.data.type === 'home') label = 'Home Address';
    else if (zParse.data.type === 'office') label = 'Office Address';
  }

  const res = await db.transaction(async (tx) => {
    const userDefaultAddress = await tx
      .select({ id: address.id })
      .from(address)
      .where(and(eq(address.userId, user.id), eq(address.isDefault, true)));

    const insertedAddress = await tx
      .insert(address)
      .values({
        ...zParse.data,
        userId: user.id,
        isDefault: userDefaultAddress.length === 0,
        isSaved: true,
        label: label ?? 'Address',
      })
      .returning();

    return insertedAddress;
  });

  revalidatePath('/my-account/addresses', 'page');

  return res;
};

export const getSavedAddressesServer = async (session?: Session) => {
  const user = session ? session.user : (await auth())?.user;
  if (!user) return;

  return await db
    .select()
    .from(address)
    .where(and(eq(address.userId, user.id), eq(address.isSaved, true)))
    .orderBy(desc(address.createdAt), address.id);
};

export const editAddressServer = async ({
  addressId,
  values,
  session,
}: {
  addressId: AddressSelect['id'];
  values: Partial<AddressSelect>;
  session?: Session;
}) => {
  const user = session ? session.user : (await auth())?.user;
  if (!user) return;

  const res = await db.transaction(async (tx) => {
    const updatedAddress = await tx
      .update(address)
      .set(values)
      .where(and(eq(address.id, addressId), eq(address.userId, user.id)))
      .returning();
    return updatedAddress;
  });

  return res;
};

export const deleteAddressServer = async ({
  addressId,
  session,
}: {
  addressId: AddressSelect['id'];
  session?: Session;
}) => {
  const user = session ? session.user : (await auth())?.user;
  if (!user) return;

  const res = await db.transaction(async (tx) => {
    const deletedAddress = await tx
      .delete(address)
      .where(and(eq(address.id, addressId), eq(address.userId, user.id)))
      .returning();

    if (!deletedAddress.at(0)?.isDefault) return true;

    const sq = tx
      .select({ id: address.id })
      .from(address)
      .where(eq(address.userId, user.id))
      .orderBy(address.createdAt, address.id)
      .limit(1);

    await tx.update(address).set({ isDefault: true }).where(eq(address.id, sq));

    return true;
  });

  return res;
};

export const changeDefaultAddressServer = async ({
  addressId,
  session,
}: {
  addressId: AddressSelect['id'];
  session?: Session;
}) => {
  const user = session ? session.user : (await auth())?.user;
  if (!user) return;

  const res = await db.transaction(async (tx) => {
    const sq = tx
      .select({ id: address.id })
      .from(address)
      .where(and(eq(address.userId, user.id), eq(address.isDefault, true)))
      .limit(1);

    const previousDefaultAddress = await tx
      .update(address)
      .set({ isDefault: false })
      .where(eq(address.id, sq))
      .returning();

    if (!previousDefaultAddress || previousDefaultAddress.length === 0) {
      tx.rollback();
      return;
    }

    const newDefaultAddress = await tx
      .update(address)
      .set({ isDefault: true })
      .where(and(eq(address.id, addressId), eq(address.userId, user.id)))
      .returning();

    if (!newDefaultAddress || newDefaultAddress.length === 0) {
      tx.rollback();
      return;
    }

    return newDefaultAddress;
  });

  return res;
};
