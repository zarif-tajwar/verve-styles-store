import { ClerkProvider } from '@clerk/nextjs';
import React from 'react';

const CustomizedClerkProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: '#080808',
        },
      }}
    >
      {children}
    </ClerkProvider>
  );
};
export default CustomizedClerkProvider;
