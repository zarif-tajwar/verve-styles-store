import { GoogleIcon, FacebookIcon } from '@/components/Svgs/icons';
import SignInButton from './SignInButton';
import bgImage from './sign-in-bg.jpg';
import Image from 'next/image';
import SignInFormWrapper from './SignInFormWrapper';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { SearchParamsServer } from '@/lib/types/common';
import { SignInPageErrorParam } from '@auth/core/types';
import { ShieldAlert } from 'lucide-react';

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

const SignInPage = async ({
  searchParams,
}: {
  searchParams: SearchParamsServer;
}) => {
  const errorMessage: string | undefined =
    typeof searchParams.error === 'string'
      ? signinErrors[searchParams.error as keyof typeof signinErrors]
      : undefined;

  return (
    <main className="grid max-w-4xl gap-4 rounded-main bg-primary-0 p-4 shadow md:grid-cols-[1fr_1.2fr] lg:grid-cols-2">
      <div className="hidden overflow-hidden rounded-main shadow-inner md:block">
        <Image
          src={bgImage}
          className="max-w-full object-cover"
          alt="Some neutral color T-shirts on a hanger."
          priority
        />
      </div>
      <div className="min-h-[20rem] p-4 sm:min-h-0 sm:p-8">
        <div className="relative flex h-full w-full flex-col justify-center gap-12 sm:gap-8">
          {errorMessage && (
            <div className="absolute left-0 top-0 grid grid-cols-[auto_1fr] gap-2 rounded-xl bg-red-100 py-2 pl-3 pr-4 text-sm text-red-800">
              <span className="pt-0.5">
                <ShieldAlert className="h-6 w-6 opacity-70" />
              </span>
              <p>{errorMessage}</p>
            </div>
          )}
          <div className="flex flex-col gap-1">
            <h1 className="text-3xl font-semibold">Get inside Verve</h1>
            <p className="text-primary-400">{`Don't keep your dream wardrobe waiting!`}</p>
          </div>
          <SignInFormWrapper />
        </div>
      </div>
    </main>
  );
};
export default SignInPage;
