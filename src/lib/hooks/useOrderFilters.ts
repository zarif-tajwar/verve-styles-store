import {
  createSerializer,
  parseAsArrayOf,
  parseAsInteger,
  parseAsIsoDateTime,
  parseAsStringLiteral,
  useQueryStates,
} from 'nuqs';
import { GetOrdersUseQueryStateSchema } from '../types/orders';
import { OrdersFilterSelectValues } from '../constants/orders';

const orderFilterParsers = {
  page: parseAsInteger,
  status: parseAsStringLiteral(OrdersFilterSelectValues),
  orderDateRange: parseAsArrayOf(parseAsIsoDateTime),
};

const orderFilterSerializer = createSerializer(orderFilterParsers);

export const useOrderFilters = () => {
  const [queryStates, setQueryStates] =
    useQueryStates<GetOrdersUseQueryStateSchema>(orderFilterParsers);

  const queryStatesSerialized = orderFilterSerializer(queryStates);

  return { queryStates, setQueryStates, queryStatesSerialized };
};
