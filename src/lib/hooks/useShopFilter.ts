'use client';

import {
  ParserBuilder,
  parseAsString,
  useQueryStates,
  Values,
  SetValues,
} from 'next-usequerystate';
import { shopFilterKeys } from '@/lib/validation/schemas';
import { useQuery, useSuspenseQuery } from '@tanstack/react-query';
import { FilteredProductItem, getShopProductsServer } from '../actions/shop';
import * as queryKeys from '@/lib/constants/query-keys';
import {
  FILTER_PRODUCTS_PER_PAGE,
  URL_QUERY_SEPERATORS,
} from '../validation/constants';
import { dynamicQueryFromObj } from '../validation/query-keys';

export type ParamKey = (typeof shopFilterKeys)[number];

export type StateSchema = Record<ParamKey, ParserBuilder<string>>;

export type ParamsState = Values<StateSchema>;

type SetParamsState = SetValues<StateSchema>;

type ProductItems = FilteredProductItem[] | undefined;

type RemoveParams<Fn extends (...args: any) => any, Params extends string[]> = (
  ...args: Parameters<Fn> extends [infer P, ...infer Rest]
    ? { [K in Exclude<keyof P, Params[number]>]: P[K] } & Rest
    : never
) => ReturnType<Fn>;

type Store = {
  paramsState: Values<StateSchema>;
  setParamsState: SetParamsState;
  productItems: ProductItems;
  isLoading: boolean;
  multipleOptionCheck: (
    values: string[],
    paramKey: ParamKey,
  ) => {
    checkedOptions: Set<string>;
    handleCheck: (checked: boolean, value: string) => void;
  };
  singleOptionCheck: (
    defaultOptionValue: string,
    paramKey: 'sort_by',
  ) => {
    currentOptionValue: string | null;
    handleValueChange: (value: string) => void;
  };
  rangeSlider: (
    defaultRange: number[],
    paramKey: 'price_range',
  ) => {
    currentRange: number[];
    handleValueChange: (newRange: number[]) => void;
  };
  pageNumberHandler: () => {
    totalPages: number;
    currentPage: number;
    handlePageChange: (pageNum: number) => void;
  };
  totalPages: number;
  currentPage: number;
  totalProducts: number | undefined;
};

export const useShopFilter = <T>(
  callback: (store: Store) => T,
  initialData?: FilteredProductItem[],
) => {
  const stateSchema = Object.fromEntries(
    shopFilterKeys.map((key) => [key, parseAsString]),
  ) as StateSchema;

  const [paramsState, setParamsState]: [ParamsState, SetParamsState] =
    useQueryStates(stateSchema);

  const paramsStateSerialized = Object.fromEntries(
    Object.entries(paramsState).filter(
      ([_, val]) => val !== null && val !== '',
    ),
  ) as SearchParamsServer;

  const queryKey = [queryKeys.SHOP_FILTER_PRODUCTS];

  // const queryKey = dynamicQueryFromObj(
  //   queryKeys.SHOP_FILTER_PRODUCTS,
  //   paramsStateSerialized,
  // );

  console.log(JSON.stringify(queryKey), 'CLIENT QUERYKEY');

  const { data: productItems, isLoading } = useQuery({
    queryKey,
    queryFn: async () => {
      // await wait(1000);
      const data = await getShopProductsServer(paramsStateSerialized);
      return data || [];
    },
    // initialData: initialData || [],
  });

  const totalProducts = productItems?.at(0)?.totalCount;
  const totalPages = Math.ceil(
    (productItems?.at(0)?.totalCount ?? 0) / FILTER_PRODUCTS_PER_PAGE,
  );
  const currentPage = Number(paramsState.page || 1);

  const multipleOptionCheck = (values: string[], paramKey: ParamKey) => {
    const optionQueryState = paramsState[paramKey];
    const checkedOptions = new Set(
      optionQueryState
        ? optionQueryState.split(URL_QUERY_SEPERATORS.multipleOption)
        : [],
    );

    const handleCheck = (checked: boolean, value: string) => {
      let checkedOptionsCopy = new Set(checkedOptions);

      if (checked === true) {
        if (checkedOptionsCopy.size + 1 === values.length) {
          checkedOptionsCopy.clear();
        } else {
          checkedOptionsCopy.add(value);
        }
      }

      if (checked === false) {
        checkedOptionsCopy.delete(value);
      }

      const newQueryValue = [...checkedOptionsCopy].join(
        URL_QUERY_SEPERATORS.multipleOption,
      );

      setParamsState({
        [paramKey]: newQueryValue !== '' ? newQueryValue : null,
        page: null,
      });
    };

    return { checkedOptions, handleCheck };
  };

  const singleOptionCheck = (
    defaultOptionValue: string,
    paramKey: 'sort_by',
  ) => {
    const currentOptionValue = paramsState[paramKey];

    const handleValueChange = (value: string) => {
      setParamsState({
        [paramKey]: value !== defaultOptionValue ? value : null,
        page: null,
      });
    };

    return { currentOptionValue, handleValueChange };
  };

  const rangeSlider = (defaultRange: number[], paramKey: 'price_range') => {
    const currentRangeQueryState = paramsState.price_range;
    const currentRange = currentRangeQueryState
      ? currentRangeQueryState.split(URL_QUERY_SEPERATORS.range).map(Number)
      : defaultRange;

    const handleValueChange = (newRange: number[]) => {
      if (newRange[0] === defaultRange[0] && newRange[1] === defaultRange[1]) {
        setParamsState({ [paramKey]: null });
        return;
      }
      const newRangeStr = newRange.join(URL_QUERY_SEPERATORS.range);
      setParamsState({
        [paramKey]: newRangeStr,
        page: null,
      });
    };

    return { currentRange, handleValueChange };
  };

  const pageNumberHandler = () => {
    const handlePageChange = (pageNum: number) => {
      if (pageNum < 1 || pageNum === currentPage || pageNum > totalPages)
        return;
      setParamsState(
        { page: pageNum.toString() },
        {
          scroll: true,
        },
      );
    };

    return { totalPages, currentPage, handlePageChange };
  };

  const store: Store = {
    paramsState,
    setParamsState,
    productItems,
    isLoading,
    multipleOptionCheck,
    rangeSlider,
    singleOptionCheck,
    pageNumberHandler,
    totalPages,
    currentPage,
    totalProducts,
  };

  return callback(store);
};
