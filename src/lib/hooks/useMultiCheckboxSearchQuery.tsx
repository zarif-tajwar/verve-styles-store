'use client';

import useQueryParams, {
  type SearchQueryUnreservedChars,
} from '@/lib/hooks/useQueryParams';
import { FilterCheckboxOption } from '@/lib/types/FilterCheckbox';
import * as Checkbox from '@radix-ui/react-checkbox';
import { useCallback, useEffect } from 'react';
import { URL_QUERY_SEPERATORS } from '../validation/constants';

interface Props {
  searchQueryKey: string;
  options: FilterCheckboxOption[];
}

export const useMultiCheckboxSearchQuery = ({
  searchQueryKey,
  options,
}: Props) => {
  const { queryParams, setQueryParams } = useQueryParams();

  const getParamsArray = () =>
    queryParams.get(searchQueryKey)?.split(URL_QUERY_SEPERATORS.multipleOption);

  const stringifyParamsArray = (params: string[]) =>
    params.join(URL_QUERY_SEPERATORS.multipleOption);

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
