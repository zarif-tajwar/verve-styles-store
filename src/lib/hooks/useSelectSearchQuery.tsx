'use client';

import { useCallback } from 'react';
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

  const getOptionValue = () => queryParams.get(searchQueryKey);

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
