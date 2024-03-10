'use client';

import { OrdersFilterSelectValues } from '@/lib/constants/orders';
import { GetOrdersUseQueryStateSchema } from '@/lib/types/orders';
import {
  SetValues,
  Values,
  parseAsArrayOf,
  parseAsInteger,
  parseAsIsoDateTime,
  parseAsStringLiteral,
  useQueryStates,
} from 'nuqs';
import React, { useTransition } from 'react';
import OrderFilters from './OrderFilters';
import OrderListingSkeleton from './OrderListingSkeleton';

const Orders = ({
  ordersListing,
  ordersPagination,
}: {
  ordersListing: React.ReactNode;
  ordersPagination: React.ReactNode;
}) => {
  const [isLoading, startTransition] = useTransition();

  const [queryStates, setQueryStates] =
    useQueryStates<GetOrdersUseQueryStateSchema>(
      {
        page: parseAsInteger,
        status: parseAsStringLiteral(OrdersFilterSelectValues),
        orderDateRange: parseAsArrayOf(parseAsIsoDateTime),
      },
      { shallow: false, startTransition },
    );

  return (
    <>
      <OrderFilters queryStates={queryStates} setQueryStates={setQueryStates} />
      {!isLoading && ordersListing}
      {isLoading && <OrderListingSkeleton />}
      {ordersPagination}
    </>
  );
};
export default Orders;

// const Orders = ({
//   ordersListing,
//   ordersPagination,
// }: {
//   ordersListing: React.ReactNode;
//   ordersPagination: React.ReactNode;
// }) => {
//   const [isLoading, startTransition] = useTransition();

//   const [queryStates, setQueryStates] =
//     useQueryStates<GetOrdersUseQueryStateSchema>(
//       {
//         page: parseAsInteger,
//         status: parseAsStringLiteral(OrdersFilterSelectValues),
//         orderDateRange: parseAsArrayOf(parseAsIsoDateTime),
//       },
//       { shallow: false, startTransition },
//     );

//   return (
//     <>
//       <OrderFilters queryStates={queryStates} setQueryStates={setQueryStates} />
//       {!isLoading && ordersListing}
//       {isLoading && <OrderListingSkeleton />}
//       {ordersPagination}
//     </>
//   );
// };
// export default Orders;
