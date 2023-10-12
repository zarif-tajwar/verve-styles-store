'use client';

import useQueryParams from '@/lib/hooks/useQueryParams';
import * as Checkbox from '@radix-ui/react-checkbox';
import { URL_QUERY_SEPERATORS } from '../validation/constants';
import { useShopFilterStore } from '../store/shop-filter';
import { ShopFilterState } from '../types/ShopFilter';
import { quickSortByReference } from '../util';

interface Props {
  searchQueryKey: keyof Pick<ShopFilterState, 'sizes' | 'clothing' | 'styles'>;
  options: string[];
}

export const useMultiCheckboxSearchQuery = ({
  searchQueryKey,
  options,
}: Props) => {
  const checkedOptions = useShopFilterStore((store) => store[searchQueryKey]);
  const updateFilterState = useShopFilterStore((store) => store.update);

  const { setQueryParams } =
    useQueryParams<Record<typeof searchQueryKey | 'page', string>>();

  const stringifyParamsArray = (params: string[]) =>
    params.join(URL_QUERY_SEPERATORS.multipleOption);

  const handleCheck = (
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

    updateFilterState({
      [searchQueryKey]: checkedOptionsCopy,
      page: 1,
    });

    setQueryParams(
      {
        [searchQueryKey]: stringifyParamsArray(
          quickSortByReference([...checkedOptionsCopy], options),
        ),
        page: undefined,
      },
      scroll,
    );
  };

  return { checkedOptions, handleCheck };
};
