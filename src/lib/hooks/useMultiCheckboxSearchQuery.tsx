'use client';

import useQueryParams from '@/lib/hooks/useQueryParams';
import { FilterCheckboxOption } from '@/lib/types/FilterCheckbox';
import * as Checkbox from '@radix-ui/react-checkbox';
import { useCallback } from 'react';
import { URL_QUERY_SEPERATORS } from '../validation/constants';
import { useShopFilterStore } from '../store/shop-filter';
import { ShopFilterState } from '../types/ShopFilter';
import { quickSortValuesByID } from '../util';

interface Props {
  searchQueryKey: keyof Pick<ShopFilterState, 'sizes' | 'clothing' | 'styles'>;
  options: FilterCheckboxOption[];
}

export const useMultiCheckboxSearchQuery = ({
  searchQueryKey,
  options,
}: Props) => {
  const checkedOptions = useShopFilterStore((store) => store[searchQueryKey]);
  const updateFilterState = useShopFilterStore((store) => store.update);

  const { queryParams, setQueryParams } = useQueryParams<{
    [key: string]: string;
  }>();

  const stringifyParamsArray = (params: string[]) =>
    params.join(URL_QUERY_SEPERATORS.multipleOption);

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

      updateFilterState({ [searchQueryKey]: checkedOptionsCopy });

      setQueryParams(
        {
          [searchQueryKey]: stringifyParamsArray(
            quickSortValuesByID([...checkedOptionsCopy], options),
          ),
        },
        scroll,
      );
    },
    [queryParams, searchQueryKey], //eslint-disable-line react-hooks/exhaustive-deps
  );

  return { checkedOptions, handleCheck };
};
