import { Button } from '@/components/UI/Button';
import Divider from '@/components/UI/Divider';
import { getOrdersServer } from '@/lib/server/user';
import { capitalize, cn } from '@/lib/util';
import React from 'react';

const orders = [...Array(10).keys()];

const OrdersListing = async () => {
  const orders = await getOrdersServer('c6fdljqz2hha29dj4ziilnwa', true);

  return (
    <div className="rounded-main px-8 py-4 ring-1 ring-primary-50">
      <ul className="grid grid-cols-1 gap-3">
        {orders.map((order, i) => {
          return (
            <React.Fragment key={i}>
              <li className="relative grid grid-cols-[1fr_auto] gap-6 rounded-2xl py-4">
                <dl className="grid grid-flow-col grid-cols-4 grid-rows-2 gap-y-3">
                  <dt className="text-sm font-semibold uppercase text-primary-300">
                    Order ID
                  </dt>
                  <dd className="font-medium">{`#${order.orderId}`}</dd>
                  <dt className="text-sm font-semibold uppercase text-primary-300">
                    Status
                  </dt>
                  <dd
                    className={cn(
                      'font-semibold',
                      order.status === 'delivered' && 'text-emerald-500',
                    )}
                  >
                    {capitalize(order.status)}
                  </dd>
                  <dt className="text-sm font-semibold uppercase text-primary-300">
                    Total Price
                  </dt>
                  <dd className="font-medium">$1999.99</dd>
                  <dt className="text-sm font-semibold uppercase text-primary-300">
                    Order Date
                  </dt>
                  <dd className="font-medium">
                    {new Intl.DateTimeFormat('en-us', {
                      dateStyle: 'long',
                    }).format(order.orderDate!)}
                  </dd>
                </dl>
                <div className="grid gap-y-2">
                  <Button
                    roundness={'lg'}
                    variant={'secondary'}
                    className="px-5"
                    size={'sm'}
                  >
                    View Details
                  </Button>
                  <Button
                    roundness={'lg'}
                    variant={'secondary'}
                    className="px-5"
                    size={'sm'}
                  >
                    Invoice
                  </Button>
                </div>
              </li>
              {i < orders.length - 1 && <Divider className="bg-primary-50" />}
            </React.Fragment>
          );
        })}
      </ul>
    </div>
  );
};
export default OrdersListing;
