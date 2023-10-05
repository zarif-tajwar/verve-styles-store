'use client';

import useQueryParams, {
  type SearchQueryUnreservedChars,
} from '@/lib/hooks/useQueryParams';
import { FilterCheckboxOption } from '@/lib/types/FilterCheckbox';
import * as Checkbox from '@radix-ui/react-checkbox';
import { useCallback, useEffect } from 'react';

interface Props {
  searchQueryValueSeparator?: SearchQueryUnreservedChars;
  searchQueryKey: string;
  options: FilterCheckboxOption[];
}

export const useMultiCheckboxSearchQuery = ({
  searchQueryValueSeparator = '~',
  searchQueryKey,
  options,
}: Props) => {
  const { queryParams, setQueryParams } = useQueryParams();

  const getParamsArray = () =>
    queryParams.get(searchQueryKey)?.split(searchQueryValueSeparator);

  const stringifyParamsArray = (params: string[]) =>
    params.join(searchQueryValueSeparator);

  // useEffect(() => {
  //   const params = getParamsArray();

  //   if (!params) return;

  //   // checking if url search param has supported values
  //   if (
  //     params.some(
  //       (paramValue) => !options.find((option) => option.value === paramValue),
  //     ) ||
  //     params.length === options.length
  //   ) {
  //     setQueryParams({ [searchQueryKey]: '' });
  //     return;
  //   }
  // }, []); //eslint-disable-line react-hooks/exhaustive-deps

  const isChecked = (value: string) =>
    Boolean(getParamsArray()?.find((paramValue) => paramValue === value));

  const handleCheck = useCallback(
    (checked: Checkbox.CheckedState, value: string, scroll: boolean = true) => {
      const params = new Set(getParamsArray());

      if (checked) {
        if (params.size + 1 === options.length) {
          params.clear();
        } else {
          params.add(value);
        }
      }

      if (!checked) {
        params.delete(value);
      }

      const newParams = Array.from(params).toSorted(
        (a, b) =>
          options.find((option) => a === option.value)?.id! -
          options.find((option) => b === option.value)?.id!,
      );

      setQueryParams(
        {
          [searchQueryKey]: stringifyParamsArray(newParams),
        },
        scroll,
      );
    },
    [queryParams], //eslint-disable-line react-hooks/exhaustive-deps
  );

  return { isChecked, handleCheck };
};
