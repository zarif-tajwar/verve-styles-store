import * as z from 'zod';

export const phoneRegex = new RegExp(/^(\+|00)[1-9][0-9 \-\(\)\.]{7,32}$/);

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
  type: z.enum(['home', 'office', 'not-relevant']).default('not-relevant'),
});

export type AddressFormSchemaType = z.infer<typeof AddressFormSchema>;

export const DefaultAddressFormSchema = z.object({
  addressId: z
    .string()
    .transform((str) => Number.parseInt(str))
    .pipe(z.number()),
});

export type DefaultAddressFormSchemaType = z.infer<
  typeof DefaultAddressFormSchema
>;
