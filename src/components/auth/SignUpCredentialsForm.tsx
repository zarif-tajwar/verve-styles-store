'use client';

import { Button } from '@/components/UI/Button';
import { Input } from '@/components/UI/Input';
import { errorToast } from '@/components/UI/Toaster';
import { signInCredentialsAction } from '@/lib/actions/auth';
import {
  CredentialsFormSchema,
  CredentialsFormSchemaType,
  SignUpCredentialsFormSchemaType,
  SignUpCredentialsFormStepSchemas,
} from '@/lib/validation/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAction } from 'next-safe-action/hooks';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  PasswordInput,
} from '../UI/Form';
import { z } from 'zod';
import { useSignUpStore } from '@/lib/store/auth';

const SignUpCredentialsForm = () => {
  const formNameAndEmail = useForm<
    z.infer<typeof SignUpCredentialsFormStepSchemas.nameAndEmail>
  >({
    resolver: zodResolver(SignUpCredentialsFormStepSchemas.nameAndEmail),
  });
  const formPassword = useForm<
    z.infer<typeof SignUpCredentialsFormStepSchemas.password>
  >({
    resolver: zodResolver(SignUpCredentialsFormStepSchemas.password),
  });
  const formVerificationCode = useForm<
    z.infer<typeof SignUpCredentialsFormStepSchemas.verificationCode>
  >({
    resolver: zodResolver(SignUpCredentialsFormStepSchemas.verificationCode),
  });

  const currentFormStep = useSignUpStore((store) => store.step);
  const setFormStep = useSignUpStore((store) => store.setStep);

  const onSubmitNameAndEmail = (
    values: z.infer<typeof SignUpCredentialsFormStepSchemas.nameAndEmail>,
  ) => {
    setFormStep('password');
  };

  const onSubmitPassword = (
    values: z.infer<typeof SignUpCredentialsFormStepSchemas.password>,
  ) => {
    setFormStep('verificationCode');
  };

  const onSubmitVerificationCode = (
    values: z.infer<typeof SignUpCredentialsFormStepSchemas.verificationCode>,
  ) => {
    setFormStep('emailAndFullname');
  };

  return (
    <div>
      {currentFormStep === 'emailAndFullname' && (
        <Form {...formNameAndEmail}>
          <form
            onSubmit={formNameAndEmail.handleSubmit(onSubmitNameAndEmail)}
            className="mb-8 flex flex-col justify-end gap-y-8"
          >
            <div className="flex min-h-[13.5rem] flex-col justify-end gap-y-6">
              <FormField
                name="fullName"
                control={formNameAndEmail.control}
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>Your name</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Enter your name"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
              <FormField
                name="email"
                control={formNameAndEmail.control}
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Enter your email address"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
            </div>
            <Button
              roundness={'lg'}
              className="w-full text-sm font-medium"
              size={'md'}
              type="submit"
            >
              Continue
            </Button>
          </form>
        </Form>
      )}
      {currentFormStep === 'password' && (
        <Form {...formPassword}>
          <form
            onSubmit={formPassword.handleSubmit(onSubmitPassword)}
            className="mb-8 flex flex-col justify-end gap-y-8"
          >
            <div className="flex min-h-[13.5rem] flex-col justify-end gap-y-6">
              <FormField
                name="password"
                control={formPassword.control}
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <PasswordInput
                          type="password"
                          placeholder="Enter your password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
              <FormField
                name="confirmPassword"
                control={formPassword.control}
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>Confirm password</FormLabel>
                      <FormControl>
                        <PasswordInput
                          type="password"
                          placeholder="Enter the same password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
            </div>
            <Button
              roundness={'lg'}
              className="w-full text-sm font-medium"
              size={'md'}
              type="submit"
            >
              Continue
            </Button>
          </form>
        </Form>
      )}
      {currentFormStep === 'verificationCode' && (
        <Form {...formVerificationCode}>
          <form
            onSubmit={formVerificationCode.handleSubmit(
              onSubmitVerificationCode,
            )}
            className="mb-8 flex flex-col justify-end gap-y-8"
          >
            <div className="flex min-h-[13.5rem] flex-col justify-end gap-y-6">
              <FormField
                name="code"
                control={formVerificationCode.control}
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>Verification Code</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your verification code"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
            </div>
            <Button
              roundness={'lg'}
              className="w-full text-sm font-medium"
              size={'md'}
              type="submit"
            >
              Submit
            </Button>
          </form>
        </Form>
      )}
      <div className="flex justify-between">
        <Link
          href={'/auth/sign-up'}
          className="text-sm font-medium text-primary-400 underline underline-offset-1 hover:text-primary-900"
        >
          Create Account
        </Link>

        <Link
          href={'/auth/sign-up'}
          className="text-sm font-medium text-primary-400 underline underline-offset-1 hover:text-primary-900"
        >
          Forgot Password?
        </Link>
      </div>
    </div>
  );
};

export default SignUpCredentialsForm;
