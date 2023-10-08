'use client';

import useQueryParams, {
  type SearchQueryUnreservedChars,
} from '@/lib/hooks/useQueryParams';
import { FilterCheckboxOption } from '@/lib/types/FilterCheckbox';
import * as Checkbox from '@radix-ui/react-checkbox';
import { useCallback, useEffect, useState } from 'react';
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
  const [checkedOptions, setCheckedOptions] = useState(new Set<string>());

  const getParamsArray = () =>
    queryParams.get(searchQueryKey)?.split(URL_QUERY_SEPERATORS.multipleOption);

  const stringifyParamsArray = (params: string[]) =>
    params.join(URL_QUERY_SEPERATORS.multipleOption);

  // const isChecked = (value: string) =>
  //   Boolean(getParamsArray()?.find((paramValue) => paramValue === value));

  useEffect(() => {
    const checkedOptionsFromUrl = getParamsArray();

    if (checkedOptionsFromUrl === undefined) {
      if (checkedOptions.size > 0) setCheckedOptions(new Set<string>());
      return;
    }

    const checkedOptionsCopy = new Set(checkedOptions);

    checkedOptionsFromUrl.forEach((option) => {
      checkedOptionsCopy.add(option);
    });

    setCheckedOptions(checkedOptionsCopy);
  }, []);

  useEffect(() => {
    setQueryParams({
      [searchQueryKey]: stringifyParamsArray(
        Array.from(checkedOptions.values()),
      ),
    });
  }, [checkedOptions]);

  const handleCheck = useCallback(
    (
      checked: Checkbox.CheckedState,
      value: string,
      scroll: boolean = false,
    ) => {
      const checkedOptionsCopy = new Set(checkedOptions);

      if (checked) {
        if (checkedOptionsCopy.size + 1 === options.length) {
          checkedOptionsCopy.clear();
        } else {
          checkedOptionsCopy.add(value);
        }
      }

      if (!checked) {
        checkedOptionsCopy.delete(value);
      }

      setCheckedOptions(checkedOptionsCopy);

      // const newParams = Array.from(params).toSorted(
      //   (a, b) =>
      //     options.find((option) => a === option.value)?.id! -
      //     options.find((option) => b === option.value)?.id!,
      // );

      // setQueryParams(
      //   {
      //     [searchQueryKey]: stringifyParamsArray(newParams),
      //   },
      //   scroll,
      // );
    },
    [queryParams, checkedOptions],
  );

  return { checkedOptions, handleCheck };
};
