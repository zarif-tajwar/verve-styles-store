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
import { CreditCardIcon, UserIcon } from '@heroicons/react/24/outline';
import * as AddressDetailsCard from '@/components/UI/AccountDetailsCard';
import React from 'react';
import { orderCustomerDetails } from '@/lib/db/schema/orderCustomerDetails';
import { calcTotalFromInvoiceData } from '@/lib/server/checkout';
import { priceFormat } from '@/lib/util';
import OrderedProducts from './OrderedProducts';

const OrderDetailsPage = async ({
  params,
}: {
  params: { orderId: string };
}) => {
  const session = await auth();
  if (!session) redirect('/auth/sign-in');

  const parsedOrderId = z.coerce.number().safeParse(params.orderId);
  if (!parsedOrderId.success) redirect('/orders');

  const orderId = parsedOrderId.data;
  const orderData = (
    await db
      .select()
      .from(orders)
      .leftJoin(orderDetails, eq(orderDetails.orderId, orders.id))
      .leftJoin(invoice, eq(invoice.orderId, orders.id))
      .leftJoin(orderPaymentDetails, eq(orderPaymentDetails.orderId, orders.id))
      .leftJoin(
        orderCustomerDetails,
        eq(orderCustomerDetails.orderId, orders.id),
      )
      .leftJoin(orderStatus, eq(orderStatus.id, orderDetails.statusId))
      .where(and(eq(orders.id, orderId), eq(orders.userId, session.user.id)))
  ).at(0);

  if (!orderData) redirect('/my-account/orders');

  const isPaid = !!orderData.order_payment_details?.orderId;
  const totalStr = orderData.invoice
    ? priceFormat(calcTotalFromInvoiceData(orderData.invoice))
    : 'N/A';

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-5">
          <h1 className="text-2xl font-semibold">{`Order #${orderId}`}</h1>
          <OrderStatus
            className="px-2.5 text-sm"
            status={orderData.order_status?.text}
          />
        </div>
        {orderData.invoice && (
          <div className="flex flex-col items-end justify-end text-sm">
            <p className="font-medium text-primary-400">Total</p>
            <p className="font-semibold text-primary-500">{totalStr}</p>
          </div>
        )}
      </div>
      <div className="grid grid-cols-1 gap-6">
        <AddressDetailsCard.Card className="">
          <AddressDetailsCard.CardHeader className="mb-6">
            <AddressDetailsCard.CardHeaderIcon className="size-10 rounded-lg">
              <Package size={24} strokeWidth={1.2} />
            </AddressDetailsCard.CardHeaderIcon>
            <div>
              <h2 className="text-lg font-semibold text-primary-500">
                Order Details
              </h2>
            </div>
          </AddressDetailsCard.CardHeader>
          <AddressDetailsCard.CardList>
            {orderData.order_details?.placedAt && (
              <AddressDetailsCard.CardListItem>
                <AddressDetailsCard.CardListItemHeading>
                  Order Placed At
                </AddressDetailsCard.CardListItemHeading>
                <AddressDetailsCard.CardListItemDescription>
                  {dateFormatter(orderData.order_details.placedAt, true)}
                </AddressDetailsCard.CardListItemDescription>
              </AddressDetailsCard.CardListItem>
            )}
            {orderData.order_details?.deliveryDate && (
              <AddressDetailsCard.CardListItem>
                <AddressDetailsCard.CardListItemHeading>
                  Estimated Delivery Date
                </AddressDetailsCard.CardListItemHeading>
                <AddressDetailsCard.CardListItemDescription>
                  {dateFormatter(orderData.order_details.deliveryDate)}
                </AddressDetailsCard.CardListItemDescription>
              </AddressDetailsCard.CardListItem>
            )}
            {orderData.order_status?.text && (
              <AddressDetailsCard.CardListItem>
                <AddressDetailsCard.CardListItemHeading>
                  Order Status
                </AddressDetailsCard.CardListItemHeading>
                <AddressDetailsCard.CardListItemDescription>
                  <OrderStatus
                    className="m-0 bg-primary-0 p-0"
                    status={orderData.order_status.text}
                  />
                </AddressDetailsCard.CardListItemDescription>
              </AddressDetailsCard.CardListItem>
            )}
          </AddressDetailsCard.CardList>
        </AddressDetailsCard.Card>
        <AddressDetailsCard.Card className="">
          <AddressDetailsCard.CardHeader className="mb-6">
            <AddressDetailsCard.CardHeaderIcon className="size-10 rounded-lg">
              <CreditCardIcon className="size-6" />
            </AddressDetailsCard.CardHeaderIcon>
            <div>
              <h2 className="text-lg font-semibold text-primary-500">
                Payment Details
              </h2>
            </div>
          </AddressDetailsCard.CardHeader>
          <AddressDetailsCard.CardList>
            <AddressDetailsCard.CardListItem>
              <AddressDetailsCard.CardListItemHeading>
                Payment Status
              </AddressDetailsCard.CardListItemHeading>
              <AddressDetailsCard.CardListItemDescription>
                {isPaid ? 'Paid' : 'Pending'}
              </AddressDetailsCard.CardListItemDescription>
            </AddressDetailsCard.CardListItem>
            <AddressDetailsCard.CardListItem>
              <AddressDetailsCard.CardListItemHeading>
                Payment Method
              </AddressDetailsCard.CardListItemHeading>
              <AddressDetailsCard.CardListItemDescription>
                {orderData.order_payment_details?.paymentMethod ?? 'N/A'}
              </AddressDetailsCard.CardListItemDescription>
            </AddressDetailsCard.CardListItem>
            <AddressDetailsCard.CardListItem>
              <AddressDetailsCard.CardListItemHeading>
                Paid Amount
              </AddressDetailsCard.CardListItemHeading>
              <AddressDetailsCard.CardListItemDescription>
                {isPaid ? totalStr : 'N/A'}
              </AddressDetailsCard.CardListItemDescription>
            </AddressDetailsCard.CardListItem>
          </AddressDetailsCard.CardList>
        </AddressDetailsCard.Card>
        <AddressDetailsCard.Card className="">
          <AddressDetailsCard.CardHeader className="mb-6">
            <AddressDetailsCard.CardHeaderIcon className="size-10 rounded-lg">
              <UserIcon className="size-6" />
            </AddressDetailsCard.CardHeaderIcon>
            <div>
              <h2 className="text-lg font-semibold text-primary-500">
                Customer Details
              </h2>
            </div>
          </AddressDetailsCard.CardHeader>
          <AddressDetailsCard.CardList>
            <AddressDetailsCard.CardListItem>
              <AddressDetailsCard.CardListItemHeading>
                Name
              </AddressDetailsCard.CardListItemHeading>
              <AddressDetailsCard.CardListItemDescription>
                {orderData.order_customer_details?.customerName}
              </AddressDetailsCard.CardListItemDescription>
            </AddressDetailsCard.CardListItem>
            <AddressDetailsCard.CardListItem>
              <AddressDetailsCard.CardListItemHeading>
                Email
              </AddressDetailsCard.CardListItemHeading>
              <AddressDetailsCard.CardListItemDescription>
                {orderData.order_customer_details?.customerEmail}
              </AddressDetailsCard.CardListItemDescription>
            </AddressDetailsCard.CardListItem>
            <AddressDetailsCard.CardListItem>
              <AddressDetailsCard.CardListItemHeading>
                Address
              </AddressDetailsCard.CardListItemHeading>
              <AddressDetailsCard.CardListItemDescription>
                {orderData.order_customer_details?.address}
              </AddressDetailsCard.CardListItemDescription>
            </AddressDetailsCard.CardListItem>
            <AddressDetailsCard.CardListItem>
              <AddressDetailsCard.CardListItemHeading>
                Country
              </AddressDetailsCard.CardListItemHeading>
              <AddressDetailsCard.CardListItemDescription>
                {orderData.order_customer_details?.country}
              </AddressDetailsCard.CardListItemDescription>
            </AddressDetailsCard.CardListItem>
            <AddressDetailsCard.CardListItem>
              <AddressDetailsCard.CardListItemHeading>
                City
              </AddressDetailsCard.CardListItemHeading>
              <AddressDetailsCard.CardListItemDescription>
                {orderData.order_customer_details?.city}
              </AddressDetailsCard.CardListItemDescription>
            </AddressDetailsCard.CardListItem>
            <AddressDetailsCard.CardListItem>
              <AddressDetailsCard.CardListItemHeading>
                Phone
              </AddressDetailsCard.CardListItemHeading>
              <AddressDetailsCard.CardListItemDescription>
                {orderData.order_customer_details?.phone}
              </AddressDetailsCard.CardListItemDescription>
            </AddressDetailsCard.CardListItem>
          </AddressDetailsCard.CardList>
        </AddressDetailsCard.Card>
        <OrderedProducts />
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
