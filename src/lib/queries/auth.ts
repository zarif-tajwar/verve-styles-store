import { errorToast } from '@/components/UI/Toaster';
import { useQuery } from '@tanstack/react-query';
import { UserObjectClient } from '../types/auth';

export const useAuthQuery = () => {
  return useQuery({
    queryKey: ['AUTH'],
    queryFn: async () => {
      try {
        const res = await fetch('/api/auth/validate', { cache: 'no-store' });
        if (res.status === 401) {
          return null;
        }
        if (!res.ok) {
          throw new Error();
        }
        const user: UserObjectClient = await res.json().then((res) => res.data);
        return user;
      } catch (error) {
        errorToast('Something went wrong while looking for user!');
        return null;
      }
    },
    refetchOnWindowFocus: false,
  });
};
