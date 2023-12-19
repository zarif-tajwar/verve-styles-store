'use client';

import { Button } from '@/components/UI/Button';
import { signInAction } from '@/lib/actions/auth';
import { BuiltInProviderType } from '@auth/core/providers';
import { ArrowRight } from 'lucide-react';
import React, { Dispatch, SetStateAction } from 'react';

const SignInButton = ({
  provider,
  icon,
  text,
  loading,
  setLoading,
}: {
  provider?: BuiltInProviderType;
  icon: React.ReactNode;
  text: string;
  loading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;
}) => {
  return (
    <Button
      size={'lg'}
      onClick={async () => {
        await signInAction(provider || 'google', { redirectTo: '/shop' });
      }}
      variant={'outline'}
      className="group w-full justify-start gap-4 px-5"
      roundness={'xl'}
    >
      {icon}
      <span>{text}</span>
      <span className="flex flex-grow -translate-x-2 justify-end opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100">
        <ArrowRight className="h-5 w-5 text-primary-300" />
      </span>
    </Button>
  );
};
export default SignInButton;
