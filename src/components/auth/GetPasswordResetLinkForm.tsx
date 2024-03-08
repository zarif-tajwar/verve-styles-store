'use client';

import { getPasswordResetLinkAction } from '@/lib/actions/auth';
import { getPasswordResetLinkSchema } from '@/lib/validation/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '../UI/Button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../UI/Form';
import { Input } from '../UI/Input';
import Spinner from '../UI/Spinner';
import { InformationCircleIcon } from '@heroicons/react/20/solid';
import { AuthFormFieldsWrapper, AuthFormWrapper } from './Common';

const GetPasswordResetLinkForm = () => {
  const form = useForm<z.infer<typeof getPasswordResetLinkSchema>>({
    resolver: zodResolver(getPasswordResetLinkSchema),
  });

  const onSubmit = async (
    values: z.infer<typeof getPasswordResetLinkSchema>,
  ) => {
    const result = await getPasswordResetLinkAction({ email: values.email });
    if (result.serverError) {
      form.setError('email', { message: result.serverError });
    }
  };

  return (
    <div>
      {!form.formState.isSubmitSuccessful && (
        <Form {...form}>
          <AuthFormWrapper asChild>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <AuthFormFieldsWrapper noMinHeight>
                <FormField
                  name="email"
                  control={form.control}
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormLabel>Account Email Address</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="Email address"
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
                className={'w-full text-sm font-medium'}
                size={'md'}
                type="submit"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting && <Spinner size={20} />}
                {!form.formState.isSubmitting && 'Submit'}
              </Button>
            </form>
          </AuthFormWrapper>
        </Form>
      )}
      {form.formState.isSubmitSuccessful && (
        <div className="grid grid-cols-[auto_1fr] gap-2 rounded-lg border border-primary-100 p-3">
          <InformationCircleIcon className="size-5 translate-y-0.5" />
          <p>
            Check your email (
            <span className="whitespace-nowrap font-semibold text-primary-900 underline">
              {form.getValues('email') ?? 'your email'}
            </span>
            ) for a password reset link.
          </p>
        </div>
      )}
    </div>
  );
};
export default GetPasswordResetLinkForm;
