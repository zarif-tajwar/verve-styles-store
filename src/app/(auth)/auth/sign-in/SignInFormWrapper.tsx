'use client';

import { GoogleIcon, FacebookIcon } from '@/components/Svgs/icons';
import SignInButton from './SignInButton';
import { useState } from 'react';
import Divider from '@/components/UI/Divider';
import LoginSimulateButton from './LoginSimulateButton';

const SignInFormWrapper = () => {
  const [isFormActive, setIsFormActive] = useState(false);
  return (
    <div className="w-full">
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
      <div className="relative my-8 flex w-full justify-center">
        <Divider className="w-[95%]" />
        <p className="absolute left-1/2 top-1/2 w-max -translate-x-1/2 -translate-y-1/2 bg-primary-0 px-2 text-sm font-semibold text-primary-300">
          For Demonstration
        </p>
      </div>
      <LoginSimulateButton
        isFormActive={isFormActive}
        setIsFormActive={setIsFormActive}
      />
    </div>
  );
};
export default SignInFormWrapper;
