'use client';

import useQueryParams from '@/lib/hooks/useQueryParams';
import { FilterCheckboxOption } from '@/lib/types/FilterCheckbox';
import * as Checkbox from '@radix-ui/react-checkbox';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { URL_QUERY_SEPERATORS } from '../validation/constants';

interface Props {
  searchQueryKey: string;
  options: FilterCheckboxOption[];
}

export const useMultiCheckboxSearchQuery = ({
  searchQueryKey,
  options,
}: Props) => {
  const { queryParams, setQueryParams } = useQueryParams<{
    [key: string]: string;
  }>();
  const [checkedOptions, setCheckedOptions] = useState(new Set<string>());
  const isMounted = useRef(false);

  const getParamsArray = () =>
    queryParams.get(searchQueryKey)?.split(URL_QUERY_SEPERATORS.multipleOption);

  const stringifyParamsArray = (params: string[]) =>
    params.join(URL_QUERY_SEPERATORS.multipleOption);

  const isNoSearchParam = queryParams.get(searchQueryKey) === null;

  // First Mount
  useEffect(() => {
    isMounted.current = true;

    const checkedOptionsFromUrl = getParamsArray();

    if (checkedOptionsFromUrl === undefined) return;

    const checkedOptionsCopy = new Set(checkedOptions);

    checkedOptionsFromUrl.forEach((option) => {
      checkedOptionsCopy.add(option);
    });

    setCheckedOptions(checkedOptionsCopy);

    return () => {
      isMounted.current = false;
    };
  }, []); //eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (isNoSearchParam && isMounted) {
      console.log(true, 'Z');
      setCheckedOptions(new Set<string>());
    }
  }, [isNoSearchParam]); //eslist-disable-line react-hooks/exhaustive-deps

  const handleCheck = useCallback(
    (
      checked: Checkbox.CheckedState,
      value: string,
      scroll: boolean = false,
    ) => {
      let checkedOptionsCopy = new Set(checkedOptions);

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
      setQueryParams({
        [searchQueryKey]: stringifyParamsArray(
          Array.from(checkedOptionsCopy.values()),
        ),
      });

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
    [queryParams, checkedOptions, searchQueryKey], //eslint-disable-line react-hooks/exhaustive-deps
  );

  return { checkedOptions, handleCheck };
};
