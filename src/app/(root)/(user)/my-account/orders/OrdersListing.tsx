import { auth } from '@/auth';
import { Button } from '@/components/UI/Button';
import Divider from '@/components/UI/Divider';
import { getOrdersServer } from '@/lib/server/user';
import { capitalize, cn, priceFormat } from '@/lib/util';
import { Session } from 'next-auth';
import React from 'react';
import OrderItemsListing from './OrderItemsListing';
import { Package } from 'lucide-react';

const orders = [...Array(10).keys()];

const OrdersListing = async ({ session }: { session: Session }) => {
  const userId = session.user.id;
  const orders = await getOrdersServer(userId, false);

  return (
    <div className="rounded-main">
      <ul className="grid grid-cols-1 gap-10 rounded-xl">
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
                          order.orderedProducts.reduce(
                            (acc, curr) => acc + curr.total,
                            0,
                          ),
                        )}
                      </dd>
                    </div>
                    <div className="space-y-1 px-4">
                      <dt className="font-semibold text-primary-300">Status</dt>
                      <dt className="-ml-2 w-max rounded-full bg-emerald-50 px-2 py-1 font-medium capitalize text-emerald-600">
                        {order.status}
                      </dt>
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
                    >
                      Show More Details
                    </Button>
                    <Button
                      className="py-1.5 text-primary-400 ring-primary-50"
                      variant={'outline'}
                      roundness={'lg'}
                    >
                      View Invoice
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
    </div>
  );
};

export default OrdersListing;
