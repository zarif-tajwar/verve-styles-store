'use client';

import { GoogleIcon, FacebookIcon } from '@/components/Svgs/icons';
import SignInButton from './SignInButton';
import { useState } from 'react';

const SignInFormWrapper = () => {
  const [isFormActive, setIsFormActive] = useState(false);
  return (
    <div className="flex w-full flex-col gap-4">
      <SignInButton
        provider="google"
        isFormActive={isFormActive}
        setIsFormActive={setIsFormActive}
        icon={
          <GoogleIcon
            width={20}
            height={20}
            className="h-[1.125rem] w-[1.125rem] sm:h-5 sm:w-5"
          />
        }
        text={`Continue with Google`}
      />

      <SignInButton
        isFormActive={isFormActive}
        setIsFormActive={setIsFormActive}
        provider="facebook"
        icon={
          <FacebookIcon
            width={20}
            height={20}
            className="h-[1.125rem] w-[1.125rem] sm:h-5 sm:w-5"
          />
        }
        text={`Continue with facebook`}
      />
    </div>
  );
};
export default SignInFormWrapper;
