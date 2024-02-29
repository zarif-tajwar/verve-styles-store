import * as z from 'zod';

export const CredentialsFormSchema = z.object({
  email: z
    .string()
    .min(1, 'Please enter your email address!')
    .email('Please enter a valid email address!'),
  password: z
    .string()
    .min(1, 'Please enter your password!')
    .min(6, 'Your password must contain atleast 6 characters!')
    .max(64, 'Your password must contain atmost 64 characters!'),
});

export type CredentialsFormSchemaType = z.infer<typeof CredentialsFormSchema>;
