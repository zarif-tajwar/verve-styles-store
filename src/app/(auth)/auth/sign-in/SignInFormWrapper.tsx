'use client';

import { GoogleIcon, FacebookIcon } from '@/components/Svgs/icons';
import SignInButton from './SignInButton';
import { useState } from 'react';
import Divider from '@/components/UI/Divider';
import LoginSimulateButton from './LoginSimulateButton';
import { Input } from '@/components/UI/Input';
import { Label } from '@/components/UI/Label';
import { Button } from '@/components/UI/Button';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  CredentialsFormSchema,
  CredentialsFormSchemaType,
} from '@/lib/validation/auth';
import { useAction } from 'next-safe-action/hooks';
import { signInCredentialsAction } from '@/lib/actions/auth';
import { errorToast, successToast } from '@/components/UI/Toaster';
import Link from 'next/link';
// import OauthSignInButton from './oauthSignInButton';

const SignInFormWrapper = () => {
  const form = useForm<CredentialsFormSchemaType>({
    resolver: zodResolver(CredentialsFormSchema),
    // reValidateMode: 'onBlur',
  });
  const { execute } = useAction(signInCredentialsAction, {
    onError: (error) => {
      // if (error.validationErrors) {
      //   console.log('inavlid Input', new Date().getTime());
      // }
      if (error.serverError) {
        errorToast(error.serverError, { position: 'top-center' });
      }
    },
  });

  const { register, handleSubmit, formState } = form;

  const onSubmit = (values: CredentialsFormSchemaType) => {
    execute(values);
  };

  return (
    <div>
      <form action="" onSubmit={handleSubmit(onSubmit)} className="mb-12">
        <div className="grid">
          <div className="mb-4 grid gap-y-1">
            <Label htmlFor="email" className="font-medium text-primary-400">
              Email address
            </Label>
            <Input
              type="text"
              placeholder="Enter your email address"
              id="email"
              {...register('email')}
            />
            {formState.errors.email && (
              <p className="text-sm text-red-500">
                {formState.errors.email.message}
              </p>
            )}
          </div>
          <div className="mb-8 grid gap-y-1">
            <Label htmlFor="password" className="font-medium text-primary-400">
              Password
            </Label>
            <Input
              type="password"
              placeholder="Enter your password"
              id="password"
              {...register('password')}
            />
            {formState.errors.password && (
              <p className="text-sm text-red-500">
                {formState.errors.password.message}
              </p>
            )}
          </div>
          <Button roundness={'lg'} className="text-sm font-medium" size={'md'}>
            Sign In
          </Button>
        </div>
      </form>
      <div className="relative mb-8 w-full">
        <p className="relative z-20 mx-auto w-max bg-primary-0 px-2 text-sm font-semibold uppercase text-primary-300">
          Or
        </p>
        <div className="absolute left-0 top-1/2 z-10 h-px w-full -translate-y-1/2 bg-primary-200"></div>
      </div>
      <div>
        <Button
          size={'md'}
          variant={'outline'}
          className="w-full gap-x-4 text-sm font-medium"
          roundness={'lg'}
          asChild
        >
          <Link href={'/auth/sign-in/google'}>
            <GoogleIcon width={20} height={20} className="size-5" />
            {'Continue with Google'}
          </Link>
        </Button>
      </div>
    </div>
  );
};

// const SignInFormWrapper = () => {
//   const [isFormActive, setIsFormActive] = useState(false);
//   return (
//     <div className="w-full">
//       <div className="flex w-full flex-col gap-4">
//         <SignInButton
//           provider="google"
//           isFormActive={isFormActive}
//           setIsFormActive={setIsFormActive}
//           icon={
//             <GoogleIcon
//               width={20}
//               height={20}
//               className="h-[1.125rem] w-[1.125rem] sm:h-5 sm:w-5"
//             />
//           }
//           text={`Continue with Google`}
//         />

//         <SignInButton
//           isFormActive={isFormActive}
//           setIsFormActive={setIsFormActive}
//           provider="facebook"
//           icon={
//             <FacebookIcon
//               width={20}
//               height={20}
//               className="h-[1.125rem] w-[1.125rem] sm:h-5 sm:w-5"
//             />
//           }
//           text={`Continue with facebook`}
//         />
//       </div>
//       <div className="relative my-8 flex w-full justify-center">
//         <Divider className="w-[95%]" />
//         <p className="absolute left-1/2 top-1/2 w-max -translate-x-1/2 -translate-y-1/2 bg-primary-0 px-2 text-sm font-semibold text-primary-300">
//           For Demonstration
//         </p>
//       </div>
//       <LoginSimulateButton
//         isFormActive={isFormActive}
//         setIsFormActive={setIsFormActive}
//       />
//     </div>
//   );
// };
export default SignInFormWrapper;
