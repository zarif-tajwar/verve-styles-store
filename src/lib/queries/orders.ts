import { useQuery } from '@tanstack/react-query';
import { ORDERS_QUERY_KEY } from '../constants/query-keys';
import { errorToast } from '@/components/UI/Toaster';
import { UserOrder } from '../types/user';
import { useOrderFilters } from '../hooks/useOrderFilters';

export const useOrdersQuery = () => {
  const { queryStates, queryStatesSerialized } = useOrderFilters();
  const url = `/api/orders${queryStatesSerialized}`;
  const queryKey = [ORDERS_QUERY_KEY, queryStates];

  return useQuery({
    queryKey,
    queryFn: async () => {
      try {
        const res = await fetch(url);
        if (!res.ok) {
          throw new Error();
        } else {
          const orders: UserOrder[] = await res.json().then((res) => res.data);
          return orders;
        }
      } catch (error) {
        errorToast('Something went wrong while getting your orders!');
        return [];
      }
    },
    refetchOnMount: false,
    placeholderData: (prev) => prev,
    staleTime: 0,
  });
};
