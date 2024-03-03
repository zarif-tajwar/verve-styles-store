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

const SignInCredentialsForm = () => {
  const form = useForm<CredentialsFormSchemaType>({
    resolver: zodResolver(CredentialsFormSchema),
  });

  const { execute } = useAction(signInCredentialsAction, {
    onError: (error) => {
      if (error.serverError) {
        errorToast(error.serverError, { position: 'top-center' });
      }
    },
  });

  const onSubmit = (values: CredentialsFormSchemaType) => {
    execute(values);
  };

  return (
    <div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="mb-8 flex flex-col justify-end gap-y-8"
        >
          <div className="flex min-h-[13.5rem] flex-col justify-end gap-y-6">
            <FormField
              name="email"
              control={form.control}
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
          </div>
          <Button
            roundness={'lg'}
            className="w-full text-sm font-medium"
            size={'md'}
            type="submit"
          >
            Sign In
          </Button>
        </form>
      </Form>
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

export default SignInCredentialsForm;
