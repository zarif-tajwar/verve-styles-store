'use client';

import { Button } from '@/components/UI/Button';
import React from 'react';

const SignInButton = ({
  children,
  provider,
}: {
  children: React.ReactNode;
  provider?: string;
}) => {
  return (
    <Button
      size={'lg'}
      variant={'outline'}
      className="w-full max-w-[26.75rem] gap-3 py-5 text-sm sm:text-base lg:gap-4 lg:py-7 lg:text-lg"
    >
      {children}
    </Button>
  );
};
export default SignInButton;
