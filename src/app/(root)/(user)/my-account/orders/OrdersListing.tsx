import { auth } from '@/auth';
import { Button } from '@/components/UI/Button';
import Divider from '@/components/UI/Divider';
import { getOrdersServer } from '@/lib/server/user';
import { capitalize, cn } from '@/lib/util';
import { Session } from 'next-auth';
import React from 'react';
import OrderItemsListing from './OrderItemsListing';
import { Package } from 'lucide-react';

const orders = [...Array(10).keys()];

const OrdersListing = async ({ session }: { session: Session }) => {
  const orders = await getOrdersServer(session.user.id, false);

  return (
    <div className="rounded-main">
      <ul className="grid grid-cols-1 gap-10 rounded-xl">
        {orders.map((order, i) => {
          return (
            <React.Fragment key={i}>
              <li className="grid grid-cols-[1.2fr_auto_1fr] gap-4 rounded-xl p-4 ring-1 ring-primary-50">
                <div className="">
                  <dl className="mb-6 grid grid-flow-col grid-cols-2 grid-rows-3 gap-4 text-sm">
                    <div className="col-span-2 flex gap-3 rounded-lg bg-primary-50 px-3 py-3 font-semibold text-primary-400">
                      <Package size={24} className="text-primary-300" />
                      <div>
                        <dt className="">Order Number</dt>
                        <dd className="text-base">{order.orderId}</dd>
                      </div>
                    </div>
                    <div className="space-y-0.5 px-3 pt-4">
                      <dt className="font-semibold text-primary-300">
                        Total Amount
                      </dt>
                      <dd className="font-semibold text-primary-400">
                        $99999.99
                      </dd>
                    </div>
                    <div className="space-y-1 px-3">
                      <dt className="font-semibold text-primary-300">Status</dt>
                      <dt className="w-max rounded-full bg-emerald-50 px-2 py-1 font-medium text-emerald-600">
                        Delivered
                      </dt>
                    </div>
                    <div className="space-y-0.5 px-3 pt-4">
                      <dt className="font-semibold text-primary-300">
                        Order Date
                      </dt>
                      <dd className="font-medium text-primary-400">
                        {new Intl.DateTimeFormat('en-us', {
                          dateStyle: 'long',
                        }).format(order.orderDate!)}
                      </dd>
                    </div>
                    {order.deliveredAt && (
                      <div className="space-y-0.5 px-3">
                        <dt className="font-semibold text-primary-300">
                          Delivered at
                        </dt>
                        <dd className="font-medium text-primary-400">
                          {new Intl.DateTimeFormat('en-us', {
                            dateStyle: 'long',
                          }).format(order.deliveredAt)}
                        </dd>
                      </div>
                    )}
                  </dl>
                  <div className="grid grid-cols-2 gap-4">
                    <Button
                      className="py-1 text-primary-400 ring-primary-50"
                      variant={'outline'}
                      roundness={'lg'}
                    >
                      Show More Details
                    </Button>
                    <Button
                      className="py-1 text-primary-400 ring-primary-50"
                      variant={'outline'}
                      roundness={'lg'}
                    >
                      View Invoice
                    </Button>
                  </div>
                </div>
                <Divider className="h-full w-px bg-primary-50" />
                <div className="group relative">
                  <OrderItemsListing />
                  <div className="duration-20 pointer-events-none absolute left-0 top-0 flex h-full w-full select-none items-center justify-center bg-white bg-opacity-80 transition-opacity hover:opacity-0 group-hover:opacity-0">
                    <p className="rounded-full bg-primary-0 px-8 py-2 text-center font-semibold text-primary-400 ring-1 ring-primary-50">
                      Hover and Scroll to see
                      <br /> Ordered Products
                    </p>
                  </div>
                </div>
              </li>
            </React.Fragment>
          );
        })}
      </ul>
    </div>
  );
};
// const OrdersListing = async ({ session }: { session: Session }) => {
//   const orders = await getOrdersServer(session.user.id, false);

//   return (
//     <div className="rounded-main px-8 py-4 ring-1 ring-primary-50">
//       <ul className="grid grid-cols-1 gap-3">
//         {orders.map((order, i) => {
//           return (
//             <React.Fragment key={i}>
//               <li className="relative grid grid-cols-[1fr_auto] gap-6 rounded-2xl py-4">
//                 <dl className="grid grid-flow-col grid-cols-4 grid-rows-2 gap-y-3">
//                   <dt className="text-sm font-semibold uppercase text-primary-300">
//                     Order ID
//                   </dt>
//                   <dd className="font-medium">{`Order #${order.orderId}`}</dd>
//                   <dt className="text-sm font-semibold uppercase text-primary-300">
//                     Status
//                   </dt>
//                   <dd
//                     className={cn(
//                       'font-semibold',
//                       order.status === 'delivered' && 'text-emerald-500',
//                     )}
//                   >
//                     {capitalize(order.status)}
//                   </dd>
//                   <dt className="text-sm font-semibold uppercase text-primary-300">
//                     Total Price
//                   </dt>
//                   <dd className="font-medium">$1999.99</dd>
//                   <dt className="text-sm font-semibold uppercase text-primary-300">
//                     Order Date
//                   </dt>
//                   <dd className="font-medium">
//                     {new Intl.DateTimeFormat('en-us', {
//                       dateStyle: 'long',
//                     }).format(order.orderDate!)}
//                   </dd>
//                 </dl>
//                 <div className="grid gap-y-2">
//                   <Button
//                     variant={'secondary'}
//                     className="h-auto rounded-md px-5 py-1 text-xs font-medium"
//                     size={'sm'}
//                   >
//                     View Details
//                   </Button>
//                   <Button
//                     variant={'secondary'}
//                     className="h-auto rounded-md px-5 py-1 text-xs font-medium"
//                     size={'sm'}
//                   >
//                     Invoice
//                   </Button>
//                 </div>
//               </li>
//               {i < orders.length - 1 && <Divider className="bg-primary-50" />}
//             </React.Fragment>
//           );
//         })}
//       </ul>
//     </div>
//   );
// };
export default OrdersListing;
