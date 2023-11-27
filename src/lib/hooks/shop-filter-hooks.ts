'use client';

import {
  ParserBuilder,
  parseAsString,
  useQueryStates,
  Values,
  SetValues,
  useQueryState,
  subscribeToQueryUpdates,
} from 'next-usequerystate';
import { shopFilterKeys } from '@/lib/validation/schemas';
import { URL_QUERY_SEPERATORS } from '@/lib/validation/constants';
import { useCallback, useEffect, useMemo, useRef } from 'react';

export type ParamKey = (typeof shopFilterKeys)[number];

export type StateSchema = Record<ParamKey, ParserBuilder<string>>;

export type ParamsState = Values<StateSchema>;

export const useReadOnlyShopFilterParams = () => {
  const stateSchema = Object.fromEntries(
    shopFilterKeys.map((key) => [key, parseAsString]),
  ) as StateSchema;

  const [paramsState] = useQueryStates(stateSchema);

  const paramsStateSerialized = Object.fromEntries(
    Object.entries(paramsState).filter(
      ([_, val]) => val !== null && val !== '',
    ),
  ) as SearchParamsServer;

  return paramsStateSerialized;
};

export const useSelectQueryState = (
  key: string,
  values: string[],
  defaultValue: string,
) => {
  const [queryState, setQueryState] = useQueryState(key);

  const isParamValid = values.some((v) => v === queryState);

  const value: string = queryState && isParamValid ? queryState : defaultValue;

  const handleChange = useCallback(
    (changedValue: string) => {
      const newParamValue = changedValue === defaultValue ? null : changedValue;
      setQueryState(newParamValue);
    },
    [defaultValue, setQueryState],
  );

  return { value, handleChange };
};

export const useMultiCheckboxQueryState = (key: string, values: string[]) => {
  const [queryState, setQueryState] = useQueryState(key);
  // const [_, setPagination] = useQueryState('page');

  const totalValuesLength = values.length;

  const parsedChecked = queryState
    ?.split(URL_QUERY_SEPERATORS.multipleOption)
    .filter((value) => values.some((x) => x === value));

  const checkedOptions = useMemo(
    () =>
      new Set(
        !parsedChecked || parsedChecked.length === totalValuesLength
          ? []
          : parsedChecked,
      ),
    [parsedChecked, totalValuesLength],
  );

  const handleChange = useCallback(
    (checked: boolean, value: string) => {
      let checkedOptionsCopy = new Set(checkedOptions);

      if (checked === true) {
        if (checkedOptionsCopy.size + 1 === totalValuesLength) {
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

      setQueryState(newQueryValue !== '' ? newQueryValue : null);

      // setPagination('1');
    },
    [checkedOptions, setQueryState, totalValuesLength],
  );

  return { checkedOptions, handleChange };
};

export const parseDoubleNumberRangeFromStr = (
  str: string | null | undefined,
  defaultRangeValue?: number[],
) => {
  const parsedRange = str
    ?.split(URL_QUERY_SEPERATORS.range)
    .map((str) => Number(str))
    .filter((num) => !Number.isNaN(num));

  let rangeValue = defaultRangeValue;

  if (!parsedRange) return rangeValue;

  if (parsedRange !== undefined && parsedRange.length !== 0) {
    if (defaultRangeValue) {
      if (
        parsedRange.length === 1 &&
        parsedRange.at(0)! <= defaultRangeValue.at(1)! &&
        parsedRange.at(0)! >= defaultRangeValue.at(0)!
      ) {
        rangeValue = [parsedRange.at(0)!, parsedRange.at(0)!];
      } else if (
        parsedRange.length === 2 &&
        parsedRange.at(0)! <= parsedRange.at(1)! &&
        parsedRange.at(0)! >= defaultRangeValue.at(0)! &&
        parsedRange.at(1)! <= defaultRangeValue.at(1)!
      ) {
        rangeValue = [parsedRange.at(0)!, parsedRange.at(1)!];
      }
    } else {
      if (parsedRange.length === 1) {
        rangeValue = [parsedRange.at(0)!, parsedRange.at(0)!];
      } else if (
        parsedRange.length === 2 &&
        parsedRange.at(0)! <= parsedRange.at(1)!
      ) {
        rangeValue = [parsedRange.at(0)!, parsedRange.at(1)!];
      }
    }
  }

  return rangeValue;
};

export const useDoubleRangeSliderQueryState = (
  key: string,
  defaultRangeValue: number[],
) => {
  const [queryState, setQueryState] = useQueryState(key);

  const rangeValue =
    parseDoubleNumberRangeFromStr(queryState, defaultRangeValue) ||
    defaultRangeValue;

  const handleChange = useCallback(
    (range: number[]) => {
      const isDefault =
        range[0] === defaultRangeValue[0] && range[1] === defaultRangeValue[1];

      setQueryState(
        isDefault ? null : range.map(String).join(URL_QUERY_SEPERATORS.range),
      );
    },
    [defaultRangeValue, setQueryState],
  );

  return { rangeValue, handleChange };
};

export const usePaginationQueryState = () => {
  const [queryState, setQueryState] = useQueryState('page');

  const value = Number(queryState || 1);

  const handleChange = useCallback(
    (pageNum: number, totalPages: number) => {
      if (pageNum < 1 || pageNum === value || pageNum > totalPages) return;
      setQueryState(pageNum.toString(), {
        scroll: true,
      });
    },
    [value, setQueryState],
  );

  return { value, handleChange };
};
