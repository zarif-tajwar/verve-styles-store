import { z } from 'zod';
import { OrdersFilterSelectValues } from '../constants/orders';

export const GetOrdersSchema = z.object({
  status: z.enum(OrdersFilterSelectValues).optional().catch(undefined),
  orderDateRange: z
    .string()
    .transform((val) => {
      const [from, to] = val.split(',');
      return { from, to };
    })
    .pipe(
      z.object({
        from: z.coerce.date().nullish(),
        to: z.coerce.date().nullish(),
      }),
    )
    .optional()
    .catch(undefined),
  page: z.coerce.number().positive().catch(1),
});

export type GetOrdersParams = z.infer<typeof GetOrdersSchema>;
