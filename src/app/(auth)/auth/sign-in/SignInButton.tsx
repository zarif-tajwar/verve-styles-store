'use client';

import { Button } from '@/components/UI/Button';
import Spinner from '@/components/UI/Spinner';
import { signInAction } from '@/lib/actions/auth';
import { cn, wait } from '@/lib/util';
import { BuiltInProviderType } from '@auth/core/providers';
import { ArrowRight } from 'lucide-react';
import React, { Dispatch, SetStateAction, useState } from 'react';

const SignInButton = ({
  provider,
  icon,
  text,
  isFormActive,
  setIsFormActive,
  className,
}: {
  provider: BuiltInProviderType;
  icon: React.ReactNode;
  text: string;
  isFormActive: boolean;
  setIsFormActive: Dispatch<SetStateAction<boolean>>;
  className?: string;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const isCurrentButtonActive = isFormActive && isLoading;

  const handleClick = async () => {
    try {
      setIsLoading(true);
      setIsFormActive(true);
      await signInAction(provider, { redirectTo: '/shop' });
      setErrorMessage(null);
    } catch (err: any) {
      setErrorMessage(err.message);
      setIsLoading(false);
      setIsFormActive(false);
    } finally {
    }
  };

  return (
    <div>
      {errorMessage && (
        <div>
          <p className="pb-1.5 text-xs font-medium text-rose-600">
            {errorMessage}
          </p>
        </div>
      )}
      <Button
        size={'lg'}
        onClick={handleClick}
        variant={'outline'}
        className={cn(
          'group w-full justify-start gap-4 px-5',
          isCurrentButtonActive &&
            'bg-primary-50 ring-primary-50 disabled:opacity-80 ',
          className,
        )}
        // roundness={'xl'}
        disabled={isFormActive}
      >
        {isCurrentButtonActive ? <Spinner className="h-5 w-5" /> : icon}
        <span>{text}</span>
        <span
          className={cn(
            'flex flex-grow -translate-x-2 justify-end opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100',
            isCurrentButtonActive && 'translate-x-0 opacity-100',
          )}
        >
          <ArrowRight className="h-5 w-5 text-primary-300" />
        </span>
      </Button>
    </div>
  );
};
export default SignInButton;
