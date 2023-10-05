'use client';

import React, { useCallback, useEffect } from 'react';
import useQueryParams from '@/lib/hooks/useQueryParams';
import { zParseSingleOptionSearchQuery } from '../validation/schemas';

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

  useEffect(() => {
    // const urlOptionValue = getOptionValue();
    // if (urlOptionValue === null) return;
    // const parsedValue = zParseSingleOptionSearchQuery(
    //   options,
    //   defaultOptionValue,
    // ).parse(urlOptionValue);
    // setQueryParams({ [searchQueryKey]: parsedValue });
  }, []); //eslint-disable-line react-hooks/exhaustive-deps

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
