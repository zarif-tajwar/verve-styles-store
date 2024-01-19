'use client';

import { useQuery } from '@tanstack/react-query';
import { getSavedAddressesAction } from '../actions/user';
import { Session } from 'next-auth/types';

export const useAddressesQuery = (session?: Session) => {
  return useQuery({
    queryKey: ['addresses'],
    queryFn: async () => {
      return await getSavedAddressesAction(session);
    },
  });
};
