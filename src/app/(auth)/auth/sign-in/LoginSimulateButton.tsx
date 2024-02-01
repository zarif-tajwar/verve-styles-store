'use client';

import { Button } from '@/components/UI/Button';
import Spinner from '@/components/UI/Spinner';
import { simulateSignInAction } from '@/lib/actions/auth';
import { cn, wait } from '@/lib/util';
import { LockOpenIcon } from '@heroicons/react/20/solid';
import { ArrowRight } from 'lucide-react';
import { Dispatch, SetStateAction, useState } from 'react';

const LoginSimulateButton = ({
  isFormActive,
  setIsFormActive,
}: {
  isFormActive: boolean;
  setIsFormActive: Dispatch<SetStateAction<boolean>>;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const isCurrentButtonActive = isFormActive && isLoading;

  const handleClick = async () => {
    setIsLoading(true);
    setIsFormActive(true);
    await simulateSignInAction();
    setIsLoading(false);
    setIsFormActive(false);
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
          'group w-full justify-start gap-4 px-5 text-primary-400',
          isCurrentButtonActive &&
            'bg-primary-50 ring-primary-50 disabled:opacity-80 ',
        )}
        disabled={isFormActive}
      >
        {isCurrentButtonActive ? (
          <Spinner className="h-5 w-5" />
        ) : (
          <LockOpenIcon className="size-5" />
        )}
        <span>
          <span className="text-sm font-medium">
            Simulate Login&nbsp;&nbsp;
          </span>
          <span className="text-xs font-semibold">(Test User)</span>
        </span>
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
export default LoginSimulateButton;
