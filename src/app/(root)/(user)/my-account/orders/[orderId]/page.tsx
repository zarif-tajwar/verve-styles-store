import { auth } from '@/auth';
import { db } from '@/lib/db';
import { invoice } from '@/lib/db/schema/invoice';
import { orderDetails, orderStatus } from '@/lib/db/schema/orderDetails';
import { orderPaymentDetails } from '@/lib/db/schema/orderPaymentDetails';
import { orders } from '@/lib/db/schema/orders';
import { and, eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import OrderStatus from '../OrderStatus';
import { Package } from 'lucide-react';
import { UserIcon } from '@heroicons/react/24/outline';

const OrderDetailsPage = async ({
  params,
}: {
  params: { orderId: string };
}) => {
  const session = await auth();
  if (!session) redirect('/auth/sign-in');

  const parsedOrderId = z.coerce.number().safeParse(params.orderId);
  if (!parsedOrderId.success) redirect('/shop');

  const orderId = parsedOrderId.data;
  const orderData = (
    await db
      .select()
      .from(orders)
      .leftJoin(orderDetails, eq(orderDetails.orderId, orders.id))
      .leftJoin(invoice, eq(invoice.orderId, orders.id))
      .leftJoin(orderPaymentDetails, eq(orderPaymentDetails.orderId, orders.id))
      .leftJoin(orderStatus, eq(orderStatus.id, orderDetails.statusId))
      .where(and(eq(orders.id, orderId), eq(orders.userId, session.user.id)))
  ).at(0);

  if (!orderData) redirect('/my-account/orders');

  const isPaid = !!orderData.order_payment_details?.orderId;

  return (
    <div>
      <div className="mb-6 flex items-center gap-5">
        <h1 className="text-2xl font-semibold">{`Order #${orderId}`}</h1>
        <OrderStatus
          className="px-2.5 text-sm"
          status={orderData.order_status?.text}
        />
      </div>
      <div className="grid gap-6">
        <div className="rounded-main border border-primary-50 p-4">
          <div className="mb-4 space-y-2">
            <span className="inline-flex size-10 items-center justify-center rounded-lg bg-primary-50 text-primary-500">
              <Package size={24} className="" strokeWidth={1.2} />
            </span>
            <div>
              <h2 className="text-lg font-semibold text-primary-500">
                Order Details
              </h2>
            </div>
          </div>
          <dl className="grid grid-cols-2 gap-x-4 gap-y-6 text-sm">
            <div className="space-y-0.5">
              <dd className="font-medium text-primary-400">Payment Status</dd>
              <dt className="font-medium text-primary-500">
                {isPaid ? `Paid` : `Pending`}
              </dt>
            </div>

            {orderData.order_details?.placedAt && (
              <div className="space-y-0.5">
                <dd className="font-medium text-primary-400">
                  Order Placed At
                </dd>
                <dt className="font-medium text-primary-500">
                  {dateFormatter(orderData.order_details.placedAt, true)}
                </dt>
              </div>
            )}
            {orderData.order_details?.deliveryDate && (
              <div className="space-y-0.5">
                <dd className="font-medium text-primary-400">
                  Estimated Delivery Date
                </dd>
                <dt className="font-medium text-primary-500">
                  {dateFormatter(orderData.order_details.deliveryDate)}
                </dt>
              </div>
            )}
            {orderData.order_status?.text && (
              <div className="space-y-0.5">
                <dd className="font-medium text-primary-400">Order Status</dd>
                <dt className="font-medium text-primary-500">
                  <OrderStatus
                    className="m-0 bg-primary-0 p-0"
                    status={orderData.order_status.text}
                  />
                </dt>
              </div>
            )}
          </dl>
        </div>
        <div className="rounded-main border border-primary-50 p-4">
          <div className="mb-4 space-y-2">
            <span className="inline-flex size-10 items-center justify-center rounded-lg bg-primary-50 text-primary-500">
              <UserIcon className="size-6" />
            </span>
            <div>
              <h2 className="text-lg font-semibold text-primary-500">
                Customer Details
              </h2>
            </div>
          </div>
          <dl className="grid grid-cols-2 gap-x-4 gap-y-6 text-sm">
            <div className="space-y-0.5">
              <dd className="font-medium text-primary-400">Payment Status</dd>
              <dt className="font-medium text-primary-500">
                {isPaid ? `Paid` : `Pending`}
              </dt>
            </div>

            {orderData.order_details?.placedAt && (
              <div className="space-y-0.5">
                <dd className="font-medium text-primary-400">
                  Order Placed At
                </dd>
                <dt className="font-medium text-primary-500">
                  {dateFormatter(orderData.order_details.placedAt, true)}
                </dt>
              </div>
            )}
            {orderData.order_details?.deliveryDate && (
              <div className="space-y-0.5">
                <dd className="font-medium text-primary-400">
                  Estimated Delivery Date
                </dd>
                <dt className="font-medium text-primary-500">
                  {dateFormatter(orderData.order_details.deliveryDate)}
                </dt>
              </div>
            )}
            {orderData.order_status?.text && (
              <div className="space-y-0.5">
                <dd className="font-medium text-primary-400">Order Status</dd>
                <dt className="font-medium text-primary-500">
                  <OrderStatus
                    className="m-0 bg-primary-0 p-0"
                    status={orderData.order_status.text}
                  />
                </dt>
              </div>
            )}
          </dl>
        </div>
      </div>
    </div>
  );
};
export default OrderDetailsPage;

export const dateFormatter = (
  timestamp: Date | number,
  includeTime: boolean = false,
) =>
  new Intl.DateTimeFormat('en-US', {
    dateStyle: 'long',
    ...(includeTime ? { timeStyle: 'short' } : {}),
  }).format(timestamp);
