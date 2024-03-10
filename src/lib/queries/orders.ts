import { useQuery } from '@tanstack/react-query';
import { ORDERS_QUERY_KEY } from '../constants/query-keys';
import { errorToast } from '@/components/UI/Toaster';
import { UserOrder } from '../types/user';

export const useOrdersQuery = () => {
  return useQuery({
    queryKey: [ORDERS_QUERY_KEY],
    queryFn: async () => {
      try {
        const res = await fetch('/api/orders');
        if (!res.ok) {
          throw new Error();
        } else {
          const orders: UserOrder[] = await res.json().then((res) => res.data);
          return orders;
        }
      } catch (error) {
        errorToast('Something went wrong getting your orders!');
        return [];
      }
    },
    refetchOnMount: false,
    placeholderData: (prev) => prev,
  });
};
