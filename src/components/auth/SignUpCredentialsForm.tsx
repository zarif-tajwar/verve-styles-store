'use client';

import { Button } from '@/components/UI/Button';
import { Input } from '@/components/UI/Input';
import {
  isEmailAlreadyRegisteredAction,
  sendEmailVerificationAction,
  validateEmailVerificationAction,
} from '@/lib/actions/auth';
import { useSignUpStore } from '@/lib/store/auth';
import { cn } from '@/lib/util';
import { SignUpCredentialsFormStepSchemas } from '@/lib/validation/auth';
import { CheckCircleIcon } from '@heroicons/react/16/solid';
import { InformationCircleIcon } from '@heroicons/react/20/solid';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter, useSearchParams } from 'next/navigation';
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
import Spinner from '../UI/Spinner';
import { errorToast } from '../UI/Toaster';
import { AuthFormFieldsWrapper, AuthFormWrapper } from './Common';
import { Suspense } from 'react';
import { AuthSkeletonForm } from './AuthSkeletons';
import { AUTH_QUERY_KEY } from '@/lib/constants/query-keys';
import { useQueryClient } from '@tanstack/react-query';

const SignUpCredentialsFormClient = () => {
  const router = useRouter();
  const qc = useQueryClient();
  const currentSearchParamsObject = useSearchParams();

  let redirectAfter = currentSearchParamsObject.get('redirectAfter');

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
    const actionRes = await isEmailAlreadyRegisteredAction({
      email: values.email,
    });

    if (!actionRes) {
      errorToast('Something went wrong!');
      return;
    }

    const { data, serverError } = actionRes;

    if (serverError && serverError.includes('email')) {
      formNameAndEmail.setError('email', {
        message: serverError,
      });
      return;
    }

    if (!data) setFormStep('password');
  };

  const onSubmitPassword = async (
    values: z.infer<typeof SignUpCredentialsFormStepSchemas.password>,
  ) => {
    const actionRes = await sendEmailVerificationAction({
      email: formNameAndEmail.getValues('email'),
      password: values.password,
      confirmPassword: values.confirmPassword,
      fullName: formNameAndEmail.getValues('fullName'),
    });

    if (!actionRes) {
      errorToast('Something went wrong!');
      return;
    }

    const { serverError } = actionRes;

    if (serverError) {
      errorToast('Something went wrong!');
      return;
    }

    setFormStep('verificationCode');
  };

  const onSubmitVerificationCode = async (
    values: z.infer<typeof SignUpCredentialsFormStepSchemas.verificationCode>,
  ) => {
    const { email, fullName } = formNameAndEmail.getValues();
    const { password, confirmPassword } = formPassword.getValues();

    const result = await validateEmailVerificationAction({
      code: values.code,
      email,
      fullName,
      password,
      confirmPassword,
      redirectAfter,
    });

    if (!result) return;

    if (result.data?.redirectAfter) {
      qc.refetchQueries({ queryKey: [AUTH_QUERY_KEY] });
      router.push(redirectAfter || '/shop');
    }

    if (result.serverError) {
      formVerificationCode.setError('code', { message: result.serverError });
      return;
    }
  };

  return (
    <>
      {currentFormStep === 'emailAndFullname' && (
        <Form {...formNameAndEmail}>
          <AuthFormWrapper asChild>
            <form
              onSubmit={formNameAndEmail.handleSubmit(onSubmitNameAndEmail)}
              className="mb-8 flex flex-col justify-end gap-y-8"
            >
              <AuthFormFieldsWrapper>
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
              </AuthFormFieldsWrapper>
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
          </AuthFormWrapper>
        </Form>
      )}
      {currentFormStep === 'password' && (
        <Form {...formPassword}>
          <AuthFormWrapper asChild>
            <form onSubmit={formPassword.handleSubmit(onSubmitPassword)}>
              <AuthFormFieldsWrapper revealAnimate>
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
              </AuthFormFieldsWrapper>
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
          </AuthFormWrapper>
        </Form>
      )}
      {currentFormStep === 'verificationCode' && (
        <Form {...formVerificationCode}>
          <AuthFormWrapper asChild>
            <form
              onSubmit={formVerificationCode.handleSubmit(
                onSubmitVerificationCode,
              )}
            >
              <AuthFormFieldsWrapper revealAnimate noMinHeight>
                <div className="grid grid-cols-[auto_1fr] gap-2 rounded-lg border border-primary-100 p-3">
                  <InformationCircleIcon className="size-5 translate-y-0.5" />
                  <p>
                    A verification code has been sent to{' '}
                    <span className="whitespace-nowrap font-semibold text-primary-900 underline">
                      {formNameAndEmail.getValues('email') ?? 'your email'}
                    </span>
                  </p>
                </div>
                <FormField
                  name="code"
                  control={formVerificationCode.control}
                  disabled={formVerificationCode.formState.isSubmitSuccessful}
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
              </AuthFormFieldsWrapper>

              <Button
                roundness={'lg'}
                className={cn(
                  'w-full gap-2 text-sm font-medium',
                  !formVerificationCode.formState.isSubmitting &&
                    formVerificationCode.formState.isSubmitSuccessful &&
                    'pointer-events-none cursor-default bg-emerald-500 text-primary-0 hover:bg-emerald-500 hover:text-primary-0',
                )}
                size={'md'}
                type="submit"
                disabled={formVerificationCode.formState.isSubmitting}
              >
                {formVerificationCode.formState.isSubmitting && (
                  <Spinner size={20} />
                )}
                {!formVerificationCode.formState.isSubmitting &&
                  !formVerificationCode.formState.isSubmitSuccessful &&
                  'Submit'}
                {!formVerificationCode.formState.isSubmitting &&
                  formVerificationCode.formState.isSubmitSuccessful && (
                    <>
                      <CheckCircleIcon className="size-4" />
                      Success
                    </>
                  )}
              </Button>
            </form>
          </AuthFormWrapper>
        </Form>
      )}
    </>
  );
};

const SignUpCredentialsForm = () => {
  return (
    <Suspense fallback={<AuthSkeletonForm />}>
      <SignUpCredentialsFormClient />
    </Suspense>
  );
};

export default SignUpCredentialsForm;
