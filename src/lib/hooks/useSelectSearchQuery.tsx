'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import useQueryParams from '@/lib/hooks/useQueryParams';

export const useSelectSearchQuery = ({
  defaultOptionValue,
  searchQueryKey,
  options,
}: {
  defaultOptionValue: string;
  searchQueryKey: string;
  options: string[];
}) => {
  const { queryParams, setQueryParams } = useQueryParams();
  const isMounted = useRef(false);
  const [selectValue, setSelectValue] = useState(defaultOptionValue);

  const getOptionValue = () => queryParams.get(searchQueryKey);
  const isNoSearchParam = getOptionValue() === null;

  useEffect(() => {
    isMounted.current = true;

    const optionValueFromUrl = getOptionValue();

    if (optionValueFromUrl === null) {
      return;
    }

    setSelectValue(optionValueFromUrl);

    return () => {
      isMounted.current = false;
    };
  }, []); //eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (isNoSearchParam && isMounted) {
      setSelectValue(defaultOptionValue);
    }
  }, [isNoSearchParam]); //eslint-disable-line react-hooks/exhaustive-deps

  const handleValueChange = useCallback(
    (value: string) => {
      setQueryParams({
        [searchQueryKey]: value === defaultOptionValue ? '' : value,
      });
    },
    [queryParams], //eslint-disable-line react-hooks/exhaustive-deps
  );

  return { getOptionValue, handleValueChange };
};
