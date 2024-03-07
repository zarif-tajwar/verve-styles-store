'use client';

import { useAction } from 'next-safe-action/hooks';
import { useSearchParams } from 'next/navigation';
import { Button } from '../UI/Button';
import { LockOpenIcon } from '@heroicons/react/20/solid';
import { cn } from '@/lib/util';
import Spinner from '../UI/Spinner';
import { simulateLoginAsTestUserAction } from '@/lib/actions/auth';

const LoginSimulateButton = ({ className }: { className?: string }) => {
  const { status, execute } = useAction(simulateLoginAsTestUserAction);

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
export default LoginSimulateButton;
