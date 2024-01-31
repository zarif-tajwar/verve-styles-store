import { SessionProvider, SessionProviderProps } from 'next-auth/react';
import React from 'react';

type ClientSessionProviderProps = SessionProviderProps;

const ClientSessionProvider = ({
  refetchInterval,
  refetchOnWindowFocus,
  refetchWhenOffline,
  ...others
}: ClientSessionProviderProps) => {
  return (
    <SessionProvider
      {...others}
      refetchInterval={refetchInterval ?? 0}
      refetchOnWindowFocus={refetchOnWindowFocus ?? false}
      refetchWhenOffline={refetchWhenOffline ?? false}
    />
  );
};

export default ClientSessionProvider;
