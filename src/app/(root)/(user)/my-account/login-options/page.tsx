import { cn } from '@/lib/util';
import SocialAccounts from './SocialAccounts';
import { Suspense } from 'react';
import LoadingState from './LoadingState';
import { dedupedAuth } from '@/auth';
import { redirect } from 'next/navigation';
import {
  AccountHeader,
  AccountHeading,
} from '@/components/account/AccountCommon';

const LoginOptions = async () => {
  const session = await dedupedAuth();
  if (!session) {
    redirect('/auth/sign-in');
  }

  return (
    <div className="w-full">
      <AccountHeader>
        <AccountHeading>Configure emails and accounts</AccountHeading>
      </AccountHeader>

      <div className="my-4 h-36 w-full rounded-lg bg-primary-50"></div>

      <div className={cn('mt-8 min-h-[32rem] rounded-main')}>
        <h2 className="mb-12 text-2xl font-semibold">Social Accounts</h2>
        <Suspense fallback={<LoadingState />}>
          <SocialAccounts session={session} />
        </Suspense>
      </div>
    </div>
  );
};
export default LoginOptions;
