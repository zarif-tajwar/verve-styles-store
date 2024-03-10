import { ParserBuilder } from 'nuqs';

export type GetOrdersUseQueryStateSchema = {
  page: ParserBuilder<number>;
  status: ParserBuilder<'delivered' | 'ongoing' | 'cancelled' | 'returned'>;
  orderDateRange: ParserBuilder<Date[]>;
};
