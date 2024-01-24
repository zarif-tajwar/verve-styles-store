import * as z from 'zod';

export const phoneRegex = new RegExp(
  /^(?:\+?\d{1,4}[\s-]?)?(?:\(\d{1,}\)[\s-]?)?\d{1,}[\s-]?\d{1,}[\s-]?\d{1,}[\s-]?\d{1,}$/,
);

export const AddressFormSchema = z.object({
  address: z
    .string()
    .min(1, 'Please enter your address!')
    .min(6, 'Address must contain atleast 6 characters')
    .max(50, 'Address must contain atmost 50 characters'),
  country: z
    .string()
    .min(1, 'Please enter your country!')
    .min(3, 'Country must contain atleast 3 characters')
    .max(50, 'Country must contain atmost 50 characters'),
  city: z
    .string()
    .min(1, 'Please enter your city!')
    .min(3, 'City must contain atleast 3 characters')
    .max(50, 'City must contain atmost 50 characters'),
  phone: z
    .string()
    .min(1, 'Please enter your phone number!')
    .regex(phoneRegex, 'Invalid Number!'),
  label: z
    .string()
    .min(3, 'Label must contain atleast 3 characters')
    .max(50, 'Label must contain atmost 50 characters')
    .optional(),
  type: z.enum(['home', 'office', 'not-relevant']).default('not-relevant'),
});

export type AddressFormSchemaType = z.infer<typeof AddressFormSchema>;

export const DefaultAddressFormSchema = z.object({
  addressId: z.coerce.number(),
});

export type DefaultAddressFormSchemaType = z.infer<
  typeof DefaultAddressFormSchema
>;
