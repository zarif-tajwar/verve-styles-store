'use client';

import { useCallback } from 'react';
import useQueryParams from '@/lib/hooks/useQueryParams';
import { useShopFilterStore } from '../store/shop-filter';

export const useSelectSearchQuery = ({
  defaultOptionValue,
  searchQueryKey,
}: {
  defaultOptionValue: string;
  searchQueryKey: string;
}) => {
  const { queryParams, setQueryParams } = useQueryParams();
  const selectValue = useShopFilterStore((store) => store.sort_by);
  const updateFilterState = useShopFilterStore((store) => store.update);

  const handleValueChange = useCallback(
    (value: string) => {
      updateFilterState({ sort_by: value });
      setQueryParams({
        [searchQueryKey]: value === defaultOptionValue ? '' : value,
      });
    },
    [queryParams], //eslint-disable-line react-hooks/exhaustive-deps
  );

  return { selectValue, handleValueChange };
};
