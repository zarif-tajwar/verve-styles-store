import { Skeleton as AccountCardSkeleton } from '@/components/UI/AccountDetailsCard';
import { db } from '@/lib/db';
import { invoice } from '@/lib/db/schema/invoice';
import { orderDetails, orderStatus } from '@/lib/db/schema/orderDetails';
import { orders } from '@/lib/db/schema/orders';
import { redirectIfNotSignedIn } from '@/lib/server/auth';
import { calcTotalFromInvoiceData } from '@/lib/server/checkout';
import { cn, priceFormat } from '@/lib/util';
import {
  InformationCircleIcon,
  NewspaperIcon,
  Square3Stack3DIcon,
} from '@heroicons/react/16/solid';
import { and, eq, getTableColumns } from 'drizzle-orm';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import { z } from 'zod';
import OrderStatus from '../OrderStatus';
import Details from './_tabs/Details';
import Invoice from './_tabs/Invoice';
import OrderedProducts from './_tabs/OrderedProducts';

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
  const authObject = await redirectIfNotSignedIn({
    redirectAfter: `/my-account/orders/${params.orderId}`,
  });

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
      .where(and(eq(orders.id, orderId), eq(orders.userId, authObject.user.id)))
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
      <div className="mb-6 flex flex-col gap-y-4 [@media(width>450px)]:flex-row [@media(width>450px)]:items-center [@media(width>450px)]:justify-between">
        <div className="flex items-center gap-5">
          <h1 className="text-2xl font-semibold">{`Order #${orderId}`}</h1>
          <OrderStatus
            className="px-2.5 text-sm"
            status={orderData.orderStatus}
          />
        </div>
        <div className="flex flex-col text-sm [@media(width>450px)]:items-end [@media(width>450px)]:justify-end">
          <p className="font-medium text-primary-400">Total</p>
          <p className="font-semibold text-primary-500">{priceFormat(total)}</p>
        </div>
      </div>
      <div className="mb-6 grid grid-cols-1 gap-1 rounded-xl bg-primary-0 p-1 ring-1 ring-inset ring-primary-50 sm:gap-2 sm:p-2 [@media(width>=380px)]:grid-cols-3">
        {tabWindows.map((tab) => {
          return (
            <Link
              className={cn(
                'inline-flex min-h-12 items-center justify-center gap-2 text-base font-semibold text-primary-400 transition-colors duration-200',
                'rounded-lg',
                'hover:bg-primary-50',
                tab.value === view &&
                  'bg-primary-100 text-primary-900 hover:bg-primary-100 hover:text-primary-900',
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
          <Suspense fallback={<AccountCardSkeleton />}>
            <Details
              orderId={orderId}
              orderStatus={orderStatusText}
              total={total}
            />
          </Suspense>
        )}
        {view === 'products' && (
          <Suspense fallback={<AccountCardSkeleton />}>
            <OrderedProducts orderId={orderId} invoiceData={invoiceData} />
          </Suspense>
        )}
        {view === 'invoice' && <Invoice />}
      </div>
    </div>
  );
};
export default OrderDetailsPage;
