'use client';

import * as Checkbox from '@radix-ui/react-checkbox';
import { useMultiCheckboxSearchQuery } from '@/lib/hooks/useMultiCheckboxSearchQuery';
import {
  URL_QUERY_SEPERATORS,
  clothingColumnNames,
  clothingItemsOptions,
} from '@/lib/validation/constants';
import { buttonVariants } from '../UI/Button';
import { QueryClient, useQueryClient } from '@tanstack/react-query';
import { useQueryState } from 'next-usequerystate';
import * as queryKeys from '@/lib/constants/query-keys';
import { useShopFilter } from '@/lib/hooks/useShopFilter';

const ClothingCheckbox = () => {
  // const { checkedOptions, handleCheck } = useMultiCheckboxSearchQuery({
  //   options: clothingColumnNames,
  //   searchQueryKey: 'clothing',
  // });
  // const [queryState, setQueryState] = useQueryState('clothing');
  const qc = useQueryClient();
  const {
    paramsState: { clothing: queryState },
    setParamsState,
  } = useShopFilter();
  const checkedOptions = new Set(
    queryState ? queryState.split(URL_QUERY_SEPERATORS.multipleOption) : [],
  );

  const handleCheck = (checked: Checkbox.CheckedState, value: string) => {
    let checkedOptionsCopy = new Set(checkedOptions);

    if (checked) {
      if (checkedOptionsCopy.size + 1 === clothingItemsOptions.length) {
        checkedOptionsCopy.clear();
      } else {
        checkedOptionsCopy.add(value);
      }
    }

    if (!checked) {
      checkedOptionsCopy.delete(value);
    }

    const newQueryValue = [...checkedOptionsCopy].join(
      URL_QUERY_SEPERATORS.multipleOption,
    );

    setParamsState({
      clothing: newQueryValue !== '' ? newQueryValue : null,
    });
  };

  return (
    <div className="grid grid-cols-2 gap-2.5 text-sm font-normal">
      {clothingItemsOptions.map((option) => (
        <Checkbox.Root
          key={option.value}
          name={option.label}
          value={option.value}
          title={
            checkedOptions.size < 1
              ? `Select ${option.label}`
              : `Also select ${option.label}`
          }
          className={buttonVariants({
            align: 'left',
            variant: 'secondary',
            roundness: 'lg',
            className:
              'py-2.5 data-[state=checked]:bg-primary-900 data-[state=checked]:text-primary-0',
          })}
          checked={checkedOptions.has(option.value)}
          onCheckedChange={(checked) => {
            handleCheck(checked, option.value);
          }}
        >
          <option.icon className="h-[18px]" />
          <div>{option.label}</div>
        </Checkbox.Root>
      ))}
    </div>
  );
};
export default ClothingCheckbox;
