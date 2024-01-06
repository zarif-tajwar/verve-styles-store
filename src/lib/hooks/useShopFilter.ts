'use client';

import {
  ParserBuilder,
  parseAsString,
  useQueryStates,
  Values,
  SetValues,
} from 'nuqs';
import { shopFilterKeys } from '@/lib/validation/schemas';
import { URL_QUERY_SEPERATORS } from '@/lib/validation/constants';
import { quickSortByReference } from '../util';
import { SearchParamsServer } from '../types/common';

export type ParamKey = (typeof shopFilterKeys)[number];

export type StateSchema = Record<ParamKey, ParserBuilder<string>>;

export type ParamsState = Values<StateSchema>;

type SetParamsState = SetValues<StateSchema>;

type Store = {
  paramsState: Values<StateSchema>;
  setParamsState: SetParamsState;
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
  handlePageChange: (pageNum: number, totalPages: number) => void;
  currentPage: number;
  paramsStateSerialized: SearchParamsServer;
};

export const useShopFilter = <T>(callback: (store: Store) => T) => {
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

      const newQueryValueSorted = quickSortByReference(
        Array.from(checkedOptionsCopy),
        values,
      ).join(URL_QUERY_SEPERATORS.multipleOption);

      setParamsState({
        [paramKey]: newQueryValueSorted !== '' ? newQueryValueSorted : null,
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

  const handlePageChange = (pageNum: number, totalPages: number) => {
    if (pageNum < 1 || pageNum === currentPage || pageNum > totalPages) return;
    setParamsState({ page: pageNum.toString() });
  };

  const store: Store = {
    paramsState,
    setParamsState,
    multipleOptionCheck,
    rangeSlider,
    singleOptionCheck,
    handlePageChange,
    currentPage,
    paramsStateSerialized,
  };

  const returnCallBack = callback(store);

  return returnCallBack;
};
