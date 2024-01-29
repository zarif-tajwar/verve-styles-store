'use client';

import { useQuery } from '@tanstack/react-query';
import { getAddressesAction } from '../actions/address';
import { Session } from 'next-auth/types';

export const useAddressesQuery = (session?: Session) => {
  return useQuery({
    queryKey: ['addresses'],
    queryFn: async () => {
      return await getAddressesAction({ session });
    },
  });
};
