'use client';

import { useSignUpStore } from '@/lib/store/auth';
import AuthFooter from './AuthFooter';
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
        <AuthFooter />
      </div>
    )
  );
};
export default SignUpSecondarySection;
