import * as z from 'zod';

const phoneRegex = new RegExp(
  /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/,
);

export const AddressFormSchema = z.object({
  address: z
    .string()
    .min(6, 'Address must contain atleast 6 characters')
    .max(50, 'Address must contain atmost 50 characters'),
  country: z
    .string()
    .min(3, 'Country must contain atleast 3 characters')
    .max(50, 'Country must contain atmost 50 characters'),
  city: z
    .string()
    .min(3, 'City must contain atleast 3 characters')
    .max(50, 'City must contain atmost 50 characters'),
  phone: z.string().regex(phoneRegex, 'Invalid Number!'),
  label: z.string().min(3).max(50).optional(),
  addressType: z
    .enum(['home', 'office', 'not-relevant'])
    .default('not-relevant'),
});

export type AddressFormSchemaType = z.infer<typeof AddressFormSchema>;
