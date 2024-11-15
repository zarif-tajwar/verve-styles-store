'use client';

import { useAction } from 'next-safe-action/hooks';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '../UI/Button';
import { LockOpenIcon } from '@heroicons/react/20/solid';
import { cn } from '@/lib/util';
import Spinner from '../UI/Spinner';
import { simulateLoginAsTestUserAction } from '@/lib/actions/auth';
import { Suspense } from 'react';
import { AuthSkeletonButton } from './AuthSkeletons';
import { useQueryClient } from '@tanstack/react-query';
import { AUTH_QUERY_KEY } from '@/lib/constants/query-keys';

type LoginSimulateButtonProps = {
  className?: string;
};

const LoginSimulateButtonClient = ({ className }: LoginSimulateButtonProps) => {
  const router = useRouter();
  const qc = useQueryClient();
  const { status, execute } = useAction(simulateLoginAsTestUserAction, {
    onSuccess: ({ data }) => {
      qc.refetchQueries({ queryKey: [AUTH_QUERY_KEY] });
      if (data) router.push(data.redirectAfter);
    },
  });

  const currentSearchParamsObject = useSearchParams();

  let redirectAfter = currentSearchParamsObject.get('redirectAfter');

  const isLoading = status === 'executing';

  return (
    <Button
      size={'md'}
      variant={'outline'}
      className={cn(
        'w-full gap-x-4 text-sm font-medium disabled:opacity-50',
        className,
      )}
      roundness={'lg'}
      onClick={async () => {
        await execute({ redirectAfter });
      }}
      disabled={isLoading}
    >
      {!isLoading && <LockOpenIcon width={20} height={20} className="size-5" />}
      {isLoading && <Spinner className="size-5" />}
      {<span>Simulate Login (Test User)</span>}
    </Button>
  );
};

const LoginSimulateButton = ({ ...props }: LoginSimulateButtonProps) => {
  return (
    <Suspense fallback={<AuthSkeletonButton />}>
      <LoginSimulateButtonClient {...props} />
    </Suspense>
  );
};

export default LoginSimulateButton;
