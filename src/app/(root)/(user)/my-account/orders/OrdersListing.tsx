'use client';

import { Button } from '@/components/UI/Button';
import Divider from '@/components/UI/Divider';
import { useOrdersQuery } from '@/lib/queries/orders';
import { priceFormat } from '@/lib/util';
import { Package } from 'lucide-react';
import Link from 'next/link';
import React, { Suspense } from 'react';
import OrderItemsListing from './OrderItemsListing';
import OrderListingSkeleton from './OrderListingSkeleton';
import OrderStatus from './OrderStatus';
import OrdersPagination from './OrdersPagination';

const OrdersListing = () => {
  return (
    <Suspense fallback={<OrderListingSkeleton />}>
      <OrdersListingClient />
    </Suspense>
  );
};

const OrdersListingClient = () => {
  const { data: orders, isFetching } = useOrdersQuery();
  return (
    <div className="rounded-main">
      {isFetching && <OrderListingSkeleton />}
      {orders && orders.length === 0 && !isFetching && (
        <p className="text-xl font-medium">No orders found!</p>
      )}
      {orders && !isFetching && (
        <ul className="relative grid grid-cols-1 gap-10 rounded-xl">
          {orders.map((order, i) => {
            return (
              <React.Fragment key={i}>
                <li className="grid gap-4 rounded-xl p-4 ring-1 ring-primary-50 xl:grid-cols-[1.2fr_auto_1fr]">
                  <div className="">
                    <dl className="mb-6 gap-4 text-sm sm:grid-cols-2 sm:gap-6">
                      <div className="flex items-center gap-4 rounded-lg bg-primary-50 px-4 py-3 font-semibold text-primary-400">
                        <span className="inline-flex size-10 items-center justify-center rounded-lg bg-primary-0">
                          <Package
                            size={24}
                            className="text-primary-300"
                            strokeWidth={1.2}
                          />
                        </span>
                        <div>
                          <dt className="">Order Number</dt>
                          <dd className="text-base">{order.orderId}</dd>
                        </div>
                      </div>
                      <div className="grid grid-cols-[auto_auto] gap-x-4 gap-y-6 py-6">
                        <div className="space-y-2 px-4 pt-4">
                          <dt className="font-semibold text-primary-300">
                            Total Amount
                          </dt>
                          <dd className="font-semibold text-primary-400">
                            {priceFormat(
                              order.orderedProducts?.reduce(
                                (acc, curr) => acc + curr.total,
                                0,
                              ),
                            )}
                          </dd>
                        </div>
                        {order.orderDate && (
                          <div className="space-y-2 px-4 pt-4">
                            <dt className="font-semibold text-primary-300">
                              Order Date
                            </dt>
                            <dd className="font-medium text-primary-400">
                              {new Intl.DateTimeFormat('en-us', {
                                dateStyle: 'long',
                              }).format(new Date(order.orderDate))}
                            </dd>
                          </div>
                        )}
                        <div className="space-y-1 px-4">
                          <dt className="font-semibold text-primary-300">
                            Status
                          </dt>
                          <dd>
                            <OrderStatus status={order.status} />
                          </dd>
                        </div>
                        {order.deliveredAt && (
                          <div className="space-y-2 px-4">
                            <dt className="font-semibold text-primary-300">
                              Delivered at
                            </dt>
                            <dd className="font-medium text-primary-400">
                              {new Intl.DateTimeFormat('en-us', {
                                dateStyle: 'long',
                              }).format(new Date(order.deliveredAt))}
                            </dd>
                          </div>
                        )}
                      </div>
                    </dl>
                    <div className="grid gap-x-4 gap-y-2 sm:grid-cols-2">
                      <Button
                        className="py-1.5 text-primary-400 ring-primary-50"
                        variant={'outline'}
                        roundness={'lg'}
                        asChild
                      >
                        <Link href={`/my-account/orders/${order.orderId}`}>
                          Show More Details
                        </Link>
                      </Button>
                      <Button
                        className="py-1.5 text-primary-400 ring-primary-50"
                        variant={'outline'}
                        roundness={'lg'}
                        asChild
                      >
                        <Link
                          href={`/my-account/orders/${order.orderId}?view=invoice`}
                        >
                          View Invoice
                        </Link>
                      </Button>
                    </div>
                  </div>
                  <Divider className="h-px w-full bg-primary-50 xl:h-full xl:w-px" />
                  <OrderItemsListing orderedProducts={order.orderedProducts} />
                </li>
              </React.Fragment>
            );
          })}
        </ul>
      )}
      {orders && <OrdersPagination ordersCount={orders.length} />}
    </div>
  );
};

export default OrdersListing;
