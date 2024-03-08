'use client';

import { Button } from '@/components/UI/Button';
import { Input } from '@/components/UI/Input';
import { errorToast } from '@/components/UI/Toaster';
import { signInCredentialsAction } from '@/lib/actions/auth';
import {
  CredentialsFormSchema,
  CredentialsFormSchemaType,
} from '@/lib/validation/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useState } from 'react';
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
import Spinner from '../UI/Spinner';
import { useSearchParams } from 'next/navigation';
import { AuthFormFieldsWrapper, AuthFormWrapper } from './Common';

const SignInCredentialsForm = () => {
  const form = useForm<CredentialsFormSchemaType>({
    resolver: zodResolver(CredentialsFormSchema),
  });
  const [loginSuccess, setLoginSuccess] = useState(false);

  const deactivateForm = form.formState.isSubmitting || loginSuccess;

  const currentSearchParamsObject = useSearchParams();

  let redirectAfter = currentSearchParamsObject.get('redirectAfter');

  const onSubmit = async (values: CredentialsFormSchemaType) => {
    const result = await signInCredentialsAction({
      ...values,
      redirectAfter,
    });

    if (!result) return;

    if (result.serverError) {
      errorToast(result.serverError, { position: 'top-center' });
      return;
    }

    setLoginSuccess(true);
  };

  return (
    <div>
      <Form {...form}>
        <AuthFormWrapper asChild>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <AuthFormFieldsWrapper>
              <FormField
                name="email"
                control={form.control}
                disabled={deactivateForm}
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
              <FormField
                name="password"
                control={form.control}
                disabled={deactivateForm}
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <PasswordInput
                          placeholder="Enter your password"
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
              disabled={deactivateForm}
            >
              {!form.formState.isSubmitting ? `Sign In` : <Spinner size={20} />}
            </Button>
          </form>
        </AuthFormWrapper>
      </Form>
      <div className="flex justify-between">
        <Link
          href={{
            pathname: '/auth/sign-up',
            query: { ...(redirectAfter ? { redirectAfter } : {}) },
          }}
          className="text-sm font-medium text-primary-400 underline underline-offset-1 hover:text-primary-900"
        >
          Create Account
        </Link>

        <Link
          href={'/auth/reset-password'}
          className="text-sm font-medium text-primary-400 underline underline-offset-1 hover:text-primary-900"
        >
          Forgotten Password?
        </Link>
      </div>
    </div>
  );
};

export default SignInCredentialsForm;
