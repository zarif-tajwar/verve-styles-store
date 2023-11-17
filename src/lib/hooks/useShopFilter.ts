'use client';

import {
  ParserBuilder,
  UseQueryStatesKeysMap,
  parseAsString,
  useQueryStates,
  createParser,
} from 'next-usequerystate';
import { shopFilterKeys } from '@/lib/validation/schemas';
import { useQuery } from '@tanstack/react-query';
import { getShopProductsServer } from '../actions/shop';
import * as queryKeys from '@/lib/constants/query-keys';
import { useCallback } from 'react';
import { wait } from '../util';

export const useShopFilter = () => {
  const stateSchema = Object.fromEntries(
    shopFilterKeys.map((key) => [key, parseAsString]),
  ) as Record<(typeof shopFilterKeys)[number], ParserBuilder<string>>;
  const [paramsState, setParamsState] = useQueryStates(stateSchema);
  const paramStateEntries = Object.entries(paramsState).filter(
    ([_, val]) => val !== null && val !== '',
  );
  const paramsStateSerialized = Object.fromEntries(
    paramStateEntries,
  ) as SearchParamsServer;

  const { data: productItems, isLoading } = useQuery({
    queryKey:
      paramStateEntries.length > 0
        ? [queryKeys.SHOP_FILTER_PRODUCTS, paramsStateSerialized]
        : [queryKeys.SHOP_FILTER_PRODUCTS],
    queryFn: async () => {
      await wait(500);
      const data = await getShopProductsServer(paramsStateSerialized);
      return data || [];
    },
  });

  const store = { paramsState, setParamsState, productItems, isLoading };
  return store;
};
