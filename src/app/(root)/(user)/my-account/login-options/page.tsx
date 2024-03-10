import {
  AccountHeader,
  AccountHeading,
} from '@/components/account/AccountCommon';
import { redirectIfNotSignedIn } from '@/lib/server/auth';
import { cn } from '@/lib/util';
import { Suspense } from 'react';
import LoadingState from './LoadingState';
import SocialAccounts from './SocialAccounts';

const LoginOptions = async () => {
  const authObject = await redirectIfNotSignedIn({
    redirectAfter: '/my-account/login-options',
  });

  return (
    <div className="w-full">
      <AccountHeader>
        <AccountHeading>Configure emails and accounts</AccountHeading>
      </AccountHeader>

      <div className="my-4 h-36 w-full rounded-lg bg-primary-50"></div>

      <div className={cn('mt-8 min-h-[32rem] rounded-main')}>
        <h2 className="mb-12 text-2xl font-semibold">Social Accounts</h2>
        <Suspense fallback={<LoadingState />}>
          <SocialAccounts user={authObject.user} />
        </Suspense>
      </div>
    </div>
  );
};
export default LoginOptions;
