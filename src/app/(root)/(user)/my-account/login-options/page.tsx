import { cn } from '@/lib/util';
import SocialAccounts from './SocialAccounts';
import { Suspense } from 'react';
import LoadingState from './LoadingState';
import { redirect } from 'next/navigation';

const LoginOptions = async () => {

  return (
    <div className="w-full">
      <div>
        <h1 className="text-2xl font-semibold">
          Configure emails and accounts
        </h1>
      </div>

      <div className="my-4 h-36 w-full rounded-lg bg-primary-50"></div>

      <div className={cn('mt-8 min-h-[32rem] rounded-main')}>
        <h2 className="mb-16 text-xl font-semibold">Social Accounts</h2>
        <Suspense fallback={<LoadingState />}>
          <SocialAccounts />
        </Suspense>
      </div>
    </div>
  );
};
export default LoginOptions;
