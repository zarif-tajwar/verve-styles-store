import * as z from 'zod';

export const CredentialsFormSchema = z.object({
  email: z
    .string({ required_error: 'Please enter your email address!' })
    .min(1, 'Please enter your email address!')
    .email('Please enter a valid email address!'),
  password: z
    .string({ required_error: 'Please enter your password!' })
    .min(1, 'Please enter your password!')
    .min(6, 'Your password must contain atleast 6 characters!')
    .max(64, 'Your password must contain atmost 64 characters!'),
});

export type CredentialsFormSchemaType = z.infer<typeof CredentialsFormSchema>;

export const SupportedOauthProvidersSchema = z.enum(['facebook', 'google']);

export const OauthSignInActionSchema = z.object({
  provider: SupportedOauthProvidersSchema,
  redirectAfterPathname: z.string().nullish().optional(),
});

export type SupportedOauthProviders = z.infer<
  typeof SupportedOauthProvidersSchema
>;

export const SignUpCredentialsFormSchema = CredentialsFormSchema.merge(
  z.object({
    fullName: z
      .string()
      .min(1, 'Please enter your full name!')
      .min(4, 'Your name must contain atleast 4 characters!')
      .max(64, 'Your name must contain atmost 64 characters!'),
  }),
);

export type SignUpCredentialsFormSchemaType = z.infer<
  typeof SignUpCredentialsFormSchema
>;

export const SignUpCredentialsFormStepSchemas = {
  nameAndEmail: z.object({
    fullName: z
      .string({ required_error: 'Please enter your full name!' })
      .min(1, 'Please enter your full name!')
      .min(4, 'Your name must contain atleast 4 characters!')
      .max(64, 'Your name must contain atmost 64 characters!'),
    email: z
      .string({ required_error: 'Please enter your email address!' })
      .min(1, 'Please enter your email address!')
      .email('Please enter a valid email address!'),
  }),
  password: z
    .object({
      password: z
        .string({ required_error: 'Please enter your password!' })
        .min(1, 'Please enter your password!')
        .min(6, 'Your password must contain atleast 6 characters!')
        .max(64, 'Your password must contain atmost 64 characters!'),
      confirmPassword: z
        .string({ required_error: 'Please re-enter your password!' })
        .min(1, 'Please re-enter your password!')
        .min(6, 'Your password must contain atleast 6 characters!')
        .max(64, 'Your password must contain atmost 64 characters!'),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: `Passwords don't match`,
      path: ['confirmPassword'],
    }),
  verificationCode: z.object({
    code: z
      .number({ required_error: 'Please enter your verification code!' })
      .min(100000, 'Must be atleast 6 digits')
      .max(999999999999, 'Invalid verification code'),
  }),
};
