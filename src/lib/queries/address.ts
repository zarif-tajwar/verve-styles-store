import { useQuery } from '@tanstack/react-query';
import { ADDRESS_QUERY_KEY } from '../constants/query-keys';
import { errorToast } from '@/components/UI/Toaster';
import { UserOrder } from '../types/user';

export const useAddressesQuery = () => {
  return useQuery({
    queryKey: [ADDRESS_QUERY_KEY],
    queryFn: async () => {
      try {
        const res = await fetch('/api/addresses');
        if (!res.ok) {
          throw new Error();
        } else {
          const addresses: UserOrder[] = await res
            .json()
            .then((res) => res.data);
          return addresses;
        }
      } catch (error) {
        errorToast('Something went wrong getting your addresses!');
        return [];
      }
    },
    refetchOnMount: false,
    placeholderData: (prev) => prev,
  });
};
