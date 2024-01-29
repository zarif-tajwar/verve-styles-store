import { auth } from '@/auth';
import { db } from '@/lib/db';
import { invoice } from '@/lib/db/schema/invoice';
import { orderDetails, orderStatus } from '@/lib/db/schema/orderDetails';
import { orders } from '@/lib/db/schema/orders';
import { and, eq, getTableColumns } from 'drizzle-orm';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import OrderStatus from '../OrderStatus';
import React, { Suspense } from 'react';
import { calcTotalFromInvoiceData } from '@/lib/server/checkout';
import { cn, priceFormat } from '@/lib/util';
import OrderedProducts from './_tabs/OrderedProducts';
import {
  InformationCircleIcon,
  NewspaperIcon,
  Square3Stack3DIcon,
} from '@heroicons/react/16/solid';
import Details from './_tabs/Details';
import Link from 'next/link';
import Invoice from './_tabs/Invoice';

const invoiceTableColumns = getTableColumns(invoice);

const viewValues = ['details', 'products', 'invoice'] as const;

type ViewValueType = (typeof viewValues)[number];

const defaultViewValue: ViewValueType = 'details';

const OrderDetailsPage = async ({
  params,
  searchParams,
}: {
  params: { orderId: string };
  searchParams: { view: string | undefined };
}) => {
  const session = await auth();
  if (!session) redirect('/auth/sign-in');

  const parsedOrderId = z.coerce.number().safeParse(params.orderId);
  if (!parsedOrderId.success) redirect('/orders');

  const orderId = parsedOrderId.data;
  const orderData = (
    await db
      .select({
        orderStatus: orderStatus.text,
        ...invoiceTableColumns,
      })
      .from(orders)
      .innerJoin(orderDetails, eq(orderDetails.orderId, orders.id))
      .innerJoin(invoice, eq(invoice.orderId, orders.id))
      .innerJoin(orderStatus, eq(orderStatus.id, orderDetails.statusId))
      .where(and(eq(orders.id, orderId), eq(orders.userId, session.user.id)))
  ).at(0);

  if (!orderData) redirect('/my-account/orders');

  const { orderStatus: orderStatusText, ...invoiceData } = orderData;

  const total = calcTotalFromInvoiceData(invoiceData);

  const tabWindows = [
    {
      title: 'Details',
      value: 'details',
      icon: InformationCircleIcon,
    },
    {
      title: 'Products',
      value: 'products',
      icon: Square3Stack3DIcon,
    },
    {
      title: 'Invoice',
      value: 'invoice',
      icon: NewspaperIcon,
    },
  ];

  let view: ViewValueType = defaultViewValue;

  if (
    searchParams.view &&
    viewValues.includes(searchParams.view as ViewValueType) &&
    searchParams.view !== defaultViewValue
  ) {
    view = searchParams.view as ViewValueType;
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-5">
          <h1 className="text-2xl font-semibold">{`Order #${orderId}`}</h1>
          <OrderStatus
            className="px-2.5 text-sm"
            status={orderData.orderStatus}
          />
        </div>
        <div className="flex flex-col items-end justify-end text-sm">
          <p className="font-medium text-primary-400">Total</p>
          <p className="font-semibold text-primary-500">{priceFormat(total)}</p>
        </div>
      </div>
      <div className="mb-6 grid grid-cols-3 gap-2 rounded-xl bg-primary-0 p-2 ring-1 ring-inset ring-primary-50">
        {tabWindows.map((tab) => {
          return (
            <Link
              className={cn(
                'inline-flex min-h-12 items-center justify-center gap-2 font-medium text-primary-500 transition-colors duration-200',
                'rounded-lg',
                'hover:bg-primary-50',
                tab.value === view && 'bg-primary-50 text-primary-900',
              )}
              key={tab.value}
              href={`/my-account/orders/${orderId}${
                tab.value !== defaultViewValue ? `?view=${tab.value}` : ``
              }`}
            >
              <tab.icon className="size-4" />
              {tab.title}
            </Link>
          );
        })}
      </div>
      <div className="grid grid-cols-1 gap-6">
        {view === 'details' && (
          <Suspense fallback={<p>Loading...</p>}>
            <Details
              orderId={orderId}
              orderStatus={orderStatusText}
              total={total}
            />
          </Suspense>
        )}
        {view === 'products' && (
          <Suspense fallback={<p>Loading...</p>}>
            <OrderedProducts orderId={orderId} invoiceData={invoiceData} />
          </Suspense>
        )}
        {view === 'invoice' && <Invoice />}
      </div>
    </div>
  );
};
export default OrderDetailsPage;
