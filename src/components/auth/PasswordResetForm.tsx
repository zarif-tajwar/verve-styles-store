'use client';

import { useForm } from 'react-hook-form';
import { Button } from '../UI/Button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  PasswordInput,
} from '../UI/Form';
import { passwordResetSchema } from '@/lib/validation/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Spinner from '../UI/Spinner';
import { passwordResetAction } from '@/lib/actions/auth';
import { errorToast } from '../UI/Toaster';
import { CheckCircleIcon } from '@heroicons/react/20/solid';
import { wait } from '@/lib/util';
import { useRouter } from 'next/navigation';
import { useAction } from 'next-safe-action/hooks';
import { AuthFormFieldsWrapper, AuthFormWrapper } from './Common';

const PasswordResetForm = () => {
  const router = useRouter();

  const form = useForm<z.infer<typeof passwordResetSchema>>({
    resolver: zodResolver(passwordResetSchema),
  });

  const { execute, status } = useAction(passwordResetAction, {
    onError: ({ serverError }) => {
      if (serverError) {
        errorToast(serverError, { position: 'top-center' });
      }
    },
  });

  const onSubmit = async (values: z.infer<typeof passwordResetSchema>) => {
    await execute(values);

    await wait(2000);

    router.push('/auth/sign-in');
  };

  return (
    <div>
      {status !== 'hasSucceeded' && (
        <Form {...form}>
          <AuthFormWrapper asChild>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <AuthFormFieldsWrapper>
                <FormField
                  name="password"
                  control={form.control}
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormLabel>New Password</FormLabel>
                        <FormControl>
                          <PasswordInput
                            type="password"
                            placeholder="Enter your new password"
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
                  control={form.control}
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormLabel>Confirm New Password</FormLabel>
                        <FormControl>
                          <PasswordInput
                            type="password"
                            placeholder="Re-enter your new password"
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
                disabled={status === 'executing'}
              >
                {status !== 'executing' ? (
                  `Change Password`
                ) : (
                  <Spinner size={20} />
                )}
              </Button>
            </form>
          </AuthFormWrapper>
        </Form>
      )}
      {status === 'hasSucceeded' && (
        <div className="grid grid-cols-[auto_1fr] gap-2 rounded-lg border border-primary-100 p-3">
          <CheckCircleIcon className="size-5 translate-y-0.5" />
          <p>Successfully resetted your password</p>
        </div>
      )}
    </div>
  );
};
export default PasswordResetForm;
