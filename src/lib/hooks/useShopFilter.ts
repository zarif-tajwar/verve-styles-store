'use client';

import { errorToast } from '@/components/UI/Toaster';
import {
  PRICE_RANGE,
  URL_QUERY_SEPERATORS,
  clothingValues,
  defaultPriceRange,
  defaultSortOptionValue,
  dressStylesValues,
  sizesValues,
  sortOptionValues,
} from '@/lib/validation/constants';
import { shopFilterKeys } from '@/lib/validation/schemas';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import {
  ParserBuilder,
  SetValues,
  Values,
  createParser,
  createSerializer,
  parseAsArrayOf,
  parseAsInteger,
  parseAsStringEnum,
  useQueryStates,
} from 'nuqs';
import { useCallback, useMemo } from 'react';
import { SHOP_FILTER_PRODUCTS_QUERY_KEY } from '../constants/query-keys';
import { FilteredProductItem } from '../server/shop';
import { quickSortByReference } from '../util';

export type ParamKey = (typeof shopFilterKeys)[number];

type MultiOptionCheckKeys = Extract<ParamKey, 'sizes' | 'styles' | 'clothing'>;
type SingleOptionCheckKeys = Extract<ParamKey, 'sort_by'>;
type RangeKeys = Extract<ParamKey, 'price_range'>;

type StateSchema2 = {
  clothing: ParserBuilder<string[]>;
  sizes: ParserBuilder<string[]>;
  styles: ParserBuilder<string[]>;
  price_range: ParserBuilder<number[]>;
  sort_by: ParserBuilder<string>;
  page: ParserBuilder<number>;
};

type QueryStates = Values<StateSchema2>;

type SetQueryStates = SetValues<StateSchema2>;

type Store = {
  queryStates: QueryStates;
  setQueryStates: SetQueryStates;
  multipleOptionCheck: (paramKey: MultiOptionCheckKeys) => {
    checkedValues: string[] | null;
    handleCheck: (isChecked: boolean, value: string) => void;
  };
  singleOptionCheck: (paramKey: SingleOptionCheckKeys) => {
    currentOptionValue: string | null;
    handleValueChange: (value: string) => void;
  };
  rangeSlider: (paramKey: RangeKeys) => {
    currentRange: number[] | null;
    handleValueChange: (newRange: number[]) => void;
  };
  handlePageChange: (pageNum: number, totalPages: number) => void;
  filterUseQueryKey: Partial<Record<ParamKey, string | undefined>>;
  filterParamsSerialized: string;
};

const multiCheckOptionValues: Record<MultiOptionCheckKeys, string[]> = {
  clothing: clothingValues,
  sizes: sizesValues,
  styles: dressStylesValues,
};

const singleCheckOptionValues: Record<
  SingleOptionCheckKeys,
  { default: string; values: string[] }
> = {
  sort_by: { default: defaultSortOptionValue, values: sortOptionValues },
};

const rangeOptionValues: Record<
  RangeKeys,
  { min: number; max: number; defaultRange: [number, number] }
> = {
  price_range: {
    min: PRICE_RANGE.min,
    max: PRICE_RANGE.max,
    defaultRange: defaultPriceRange,
  },
};

const rangeParser = (
  min: number,
  max: number,
  defaultRange: [number, number],
) => {
  return createParser({
    parse: (value) => {
      const currentRange = value
        .split(URL_QUERY_SEPERATORS.range)
        .map((str) => Number.parseInt(str))
        .filter((v) => !Number.isNaN(v));

      if (currentRange.length !== 2) return null;

      const [currentMin, currentMax] = currentRange;

      if (currentMin === undefined || currentMax === undefined) return null;

      const isValidRange =
        currentMin <= currentMax &&
        currentMin >= min &&
        currentMax <= max &&
        !(currentMin === defaultRange[0] && currentMax === defaultRange[1]);

      if (!isValidRange) return null;

      return currentRange;
    },
    serialize: (value) => {
      return value.join(URL_QUERY_SEPERATORS.range);
    },
  });
};

const queryStateParsers = {
  clothing: parseAsArrayOf(
    parseAsStringEnum(multiCheckOptionValues['clothing']),
    URL_QUERY_SEPERATORS.multipleOption,
  ),
  sizes: parseAsArrayOf(
    parseAsStringEnum(multiCheckOptionValues['sizes']),
    URL_QUERY_SEPERATORS.multipleOption,
  ),
  styles: parseAsArrayOf(
    parseAsStringEnum(multiCheckOptionValues['styles']),
    URL_QUERY_SEPERATORS.multipleOption,
  ),
  price_range: rangeParser(
    rangeOptionValues.price_range.min,
    rangeOptionValues.price_range.max,
    rangeOptionValues.price_range.defaultRange,
  ),
  sort_by: parseAsStringEnum(sortOptionValues),
  page: parseAsInteger,
};

const serializer = createSerializer(queryStateParsers);

export const useShopFilter = <T>(callback: (store: Store) => T) => {
  const [queryStates, setQueryStates]: [QueryStates, SetQueryStates] =
    useQueryStates(queryStateParsers);

  const { clothing, page, price_range, sizes, sort_by, styles } = queryStates;

  const filterUseQueryKey: Partial<Record<ParamKey, string | undefined>> =
    useMemo(
      () => ({
        clothing:
          clothing?.join(URL_QUERY_SEPERATORS.multipleOption) ?? undefined,
        styles: styles?.join(URL_QUERY_SEPERATORS.multipleOption) ?? undefined,
        sizes: sizes?.join(URL_QUERY_SEPERATORS.multipleOption) ?? undefined,
        price_range: price_range?.join(URL_QUERY_SEPERATORS.range) ?? undefined,
        sort_by: sort_by ?? undefined,
        page: page?.toString() ?? undefined,
      }),
      [clothing, page, price_range, sizes, sort_by, styles],
    );

  const filterParamsSerialized = useMemo(
    () => serializer(queryStates),
    [queryStates],
  );

  const multipleOptionCheck = useCallback(
    (paramKey: MultiOptionCheckKeys) => {
      const checkedValues = queryStates[paramKey];
      const allValues = multiCheckOptionValues[paramKey];

      const handleCheck = (isChecked: boolean, value: string) => {
        let newCheckedValues: string[] = checkedValues || [];
        if (isChecked) {
          newCheckedValues = [value, ...newCheckedValues];
          if (newCheckedValues.length === allValues.length) {
            setQueryStates({ [paramKey]: null, page: null });
            return;
          }
        } else {
          newCheckedValues = newCheckedValues.filter(
            (option) => option !== value,
          );
          if (newCheckedValues.length === 0) {
            setQueryStates({ [paramKey]: null, page: null });
            return;
          }
        }
        setQueryStates({
          [paramKey]: quickSortByReference(newCheckedValues, allValues),
          page: null,
        });
      };

      return { checkedValues, handleCheck };
    },
    [queryStates, setQueryStates],
  );

  const singleOptionCheck = (paramKey: SingleOptionCheckKeys) => {
    const currentOptionValue = queryStates[paramKey];
    const defaultOptionValue = singleCheckOptionValues[paramKey].default;

    const handleValueChange = (value: string) => {
      setQueryStates({
        [paramKey]: value !== defaultOptionValue ? value : null,
        page: null,
      });
    };

    return { currentOptionValue, handleValueChange };
  };

  const rangeSlider = useCallback(
    (paramKey: RangeKeys) => {
      const currentRange = queryStates[paramKey];
      const defaultRange = rangeOptionValues[paramKey].defaultRange;

      const handleValueChange = (newRange: number[]) => {
        const [currentMin, currentMax] = newRange;

        const isValidRange =
          currentMin !== undefined &&
          currentMax !== undefined &&
          !(currentMin === defaultRange[0] && currentMax === defaultRange[1]);

        if (!isValidRange) {
          setQueryStates({ [paramKey]: null, page: null });
          return;
        }

        setQueryStates({
          [paramKey]: newRange,
          page: null,
        });
      };

      return { currentRange, handleValueChange };
    },
    [queryStates, setQueryStates],
  );

  const handlePageChange = (pageNum: number, totalPages: number) => {
    const currentPage = queryStates.page;
    if (pageNum <= 1 || pageNum === currentPage || pageNum > totalPages) {
      setQueryStates({ page: null });
      return;
    }
    setQueryStates({ page: pageNum });
  };

  const store: Store = {
    queryStates,
    setQueryStates,
    singleOptionCheck,
    handlePageChange,
    multipleOptionCheck,
    rangeSlider,
    filterUseQueryKey,
    filterParamsSerialized,
  };

  const returnCallBack = callback(store);

  return returnCallBack;
};

export const useShopQuery = () => {
  const filterUseQueryKey = useShopFilter((store) => store.filterUseQueryKey);

  const filterParamsSerialized = useShopFilter(
    (store) => store.filterParamsSerialized,
  );

  const url = `/api/shop${filterParamsSerialized}`;

  const queryKey = [SHOP_FILTER_PRODUCTS_QUERY_KEY, filterUseQueryKey];

  return useQuery({
    queryKey,
    queryFn: async () => {
      let products: FilteredProductItem[] = [];
      try {
        const res = await fetch(url);
        if (!res.ok) {
          throw new Error();
        } else {
          products = (await res.json()).data;
        }
      } catch (error) {
        errorToast('Something went wrong while fetching the products!');
      }
      return products;
    },
    placeholderData: keepPreviousData,
  });
};
