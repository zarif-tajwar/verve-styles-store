'use client';

import { Button } from '@/components/UI/Button';
import { Input } from '@/components/UI/Input';
import { useSignUpStore } from '@/lib/store/auth';
import { SignUpCredentialsFormStepSchemas } from '@/lib/validation/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  PasswordInput,
} from '../UI/Form';
import { wait } from '@/lib/util';
import Spinner from '../UI/Spinner';

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

  const onSubmitNameAndEmail = async (
    values: z.infer<typeof SignUpCredentialsFormStepSchemas.nameAndEmail>,
  ) => {
    await wait(500);
    setFormStep('password');
  };

  const onSubmitPassword = async (
    values: z.infer<typeof SignUpCredentialsFormStepSchemas.password>,
  ) => {
    await wait(500);
    setFormStep('verificationCode');
  };

  const onSubmitVerificationCode = async (
    values: z.infer<typeof SignUpCredentialsFormStepSchemas.verificationCode>,
  ) => {
    await wait(500);
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
            <div className="flex min-h-[13.5rem] flex-col justify-center gap-y-6">
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
              disabled={formNameAndEmail.formState.isSubmitting}
            >
              {!formNameAndEmail.formState.isSubmitting ? (
                `Continue`
              ) : (
                <Spinner size={20} />
              )}
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
            <div className="flex min-h-[13.5rem] flex-col justify-center gap-y-6">
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
                          placeholder="Re-enter your password"
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
              disabled={formPassword.formState.isSubmitting}
            >
              {!formPassword.formState.isSubmitting ? (
                `Continue`
              ) : (
                <Spinner size={20} />
              )}
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
            <div className="flex min-h-[13.5rem] flex-col justify-center gap-y-6">
              <FormField
                name="code"
                control={formVerificationCode.control}
                render={({ field: { onChange, ...rest } }) => {
                  return (
                    <FormItem>
                      <FormLabel>Verification Code</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your verification code"
                          type="number"
                          onChange={(e) => {
                            const value = Number.parseInt(e.target.value);
                            onChange(value || undefined);
                          }}
                          {...rest}
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
              disabled={formVerificationCode.formState.isSubmitting}
            >
              {!formVerificationCode.formState.isSubmitting ? (
                `Submit`
              ) : (
                <Spinner size={20} />
              )}
            </Button>
          </form>
        </Form>
      )}
      <p className="text-sm text-primary-300">
        Already have an account?&nbsp;
        <Link
          href={'/auth/sign-in'}
          className="text-sm font-medium text-primary-400 underline underline-offset-1 hover:text-primary-900"
        >
          Sign In
        </Link>
      </p>
    </div>
  );
};

export default SignUpCredentialsForm;
