'use client';

import { Button } from '@/components/UI/Button';
import Divider from '@/components/UI/Divider';
import { getOrdersAction } from '@/lib/actions/user';
import { useOrderFilterStore } from '@/lib/store/user-order';
import { priceFormat } from '@/lib/util';
import { useQuery } from '@tanstack/react-query';
import { Package } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import React from 'react';
import OrderItemsListing from './OrderItemsListing';
import OrderListingSkeleton from './OrderListingSkeleton';
import OrderStatus from './OrderStatus';
import OrdersPagination from './OrdersPagination';

const OrdersListing = () => {
  const session = useSession();
  const userId = session.data?.user.id;
  const status = useOrderFilterStore((store) => store.status);
  const page = useOrderFilterStore((store) => store.page);
  const orderDateRange = useOrderFilterStore((store) => store.orderDateRange);

  const {
    data: orders,
    isFetching,
    isLoading,
    isFetched,
  } = useQuery({
    queryKey: [status, orderDateRange, page],
    queryFn: async () => {
      // await wait(1000);
      if (!userId) return [];

      const data = await getOrdersAction(
        userId,
        false,
        status,
        orderDateRange,
        page,
      );

      return data || [];
    },
    placeholderData: [],
  });

  if (!userId) {
    return null;
  }
  // if (isFetching) {
  //   return <OrderListingSkeleton />;
  // }
  // if (!orders) {
  //   return null;
  // }

  // const orders = await getOrdersServer(userId, false);

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
                <li className="grid grid-cols-[1.2fr_auto_1fr] gap-4 rounded-xl p-4 ring-1 ring-primary-50">
                  <div className="">
                    <dl className="mb-6 grid grid-flow-col grid-cols-2 grid-rows-3 gap-6 text-sm">
                      <div className="col-span-2 flex items-center gap-4 rounded-lg bg-primary-50 px-4 py-3 font-semibold text-primary-400">
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
                      <div className="space-y-1 px-4">
                        <dt className="font-semibold text-primary-300">
                          Status
                        </dt>
                        <dd>
                          <OrderStatus status={order.status} />
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
                    </dl>
                    <div className="grid grid-cols-2 gap-4">
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
                  <Divider className="h-full w-px bg-primary-50" />
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
