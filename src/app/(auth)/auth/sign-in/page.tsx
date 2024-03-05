import OauthSignInButton from '@/components/auth/OauthSignInButton';
import SignInCredentialsForm from '@/components/auth/SignInCredentialsForm';
import { validateRequest } from '@/lib/server/auth';
import { SearchParamsServer } from '@/lib/types/common';
import { SignInPageErrorParam } from '@auth/core/types';
import { ShieldAlert } from 'lucide-react';
import { Metadata } from 'next';
import Image from 'next/image';
import SignOutButton from './SignOutButton';
import Link from 'next/link';
import { cn } from '@/lib/util';

const signinErrors: Record<SignInPageErrorParam | 'default', string> = {
  default: 'Unable to sign in.',
  Signin: 'Try signing in with a different account.',
  OAuthSignin: 'Try signing in with a different account.',
  OAuthCallbackError: 'Try signing in with a different account.',
  OAuthCreateAccount: 'Try signing in with a different account.',
  EmailCreateAccount: 'Try signing in with a different account.',
  Callback: 'Try signing in with a different account.',
  OAuthAccountNotLinked:
    'To confirm your identity, sign in with the same account you used originally.',
  EmailSignin: 'The e-mail could not be sent.',
  CredentialsSignin:
    'Sign in failed. Check the details you provided are correct.',
  SessionRequired: 'Please sign in to access this page.',
};

export const metadata: Metadata = {
  title: `Sign In to Verve Styles`,
  description: `Don't keep your dream wardrobe waiting. Sign In NOW!`,
};

const SignInPage = async ({
  searchParams,
}: {
  searchParams: SearchParamsServer;
}) => {
  const errorMessage: string | undefined =
    typeof searchParams.error === 'string'
      ? signinErrors[searchParams.error as keyof typeof signinErrors]
      : undefined;

  const auth = await validateRequest();

  return (
    <main
      className={cn(
        'relative h-[calc(100dvh-var(--screen-padding)*2)] w-full rounded-main',
        // 'grid grid-cols-[1fr_1fr]',
      )}
    >
      <div className="absolute z-50">
        <p>{JSON.stringify(auth)}</p>
        <SignOutButton />
      </div>

      <div className="relative flex h-full w-full flex-col items-center justify-center rounded-main bg-primary-0 shadow-sm">
        {errorMessage && (
          <div className="absolute left-0 top-0 grid grid-cols-[auto_1fr] gap-2 rounded-xl bg-red-100 py-2 pl-3 pr-4 text-sm text-red-800">
            <span className="pt-0.5">
              <ShieldAlert className="h-6 w-6 opacity-70" />
            </span>
            <p>{errorMessage}</p>
          </div>
        )}
        <div className="w-full max-w-sm">
          <div className="mb-16">
            <h1 className="mb-2 text-3xl font-semibold">
              Login
              <span className="text-lg font-medium text-primary-300">
                &nbsp;&nbsp;To Verve
              </span>
            </h1>
            <p className="text-lg text-primary-400">{`Don't keep your dream wardrobe waiting!`}</p>
          </div>
          <SignInCredentialsForm />

          <div className="relative my-10 w-full">
            <p className="relative z-20 mx-auto w-max bg-primary-0 px-2 text-sm font-semibold uppercase text-primary-300">
              Or
            </p>
            <div className="absolute left-0 top-1/2 z-10 h-px w-full -translate-y-1/2 bg-primary-200"></div>
          </div>
          <div className="grid gap-y-4">
            <OauthSignInButton provider="google" />
            <OauthSignInButton provider="facebook" />
          </div>
        </div>
      </div>
      {/* <div className="hidden overflow-hidden rounded-main md:block"></div> */}
    </main>
  );
};
export default SignInPage;
