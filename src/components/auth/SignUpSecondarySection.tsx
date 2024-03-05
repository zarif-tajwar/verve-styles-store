'use client';

import { useSignUpStore } from '@/lib/store/auth';
import OauthSignInButton from './OauthSignInButton';
import SignInLink from './SignInLink';

const SignUpSecondarySection = () => {
  const formStep = useSignUpStore((store) => store.step);

  return (
    formStep === 'emailAndFullname' && (
      <div>
        <p className="text-sm text-primary-300">
          Already have an account?&nbsp;
          <SignInLink className="text-sm font-medium text-primary-400 underline underline-offset-1 hover:text-primary-900">
            Sign In
          </SignInLink>
        </p>
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
    )
  );
};
export default SignUpSecondarySection;
