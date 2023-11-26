'use client';

import * as Checkbox from '@radix-ui/react-checkbox';
import { clothingItemsOptions } from '@/lib/validation/constants';
import { buttonVariants } from '../UI/Button';
import { useMultiCheckboxQueryState } from '@/lib/hooks/shop-filter-hooks';
import { useMemo } from 'react';

const ClothingCheckbox = () => {
  const allOptionValues = useMemo(
    () => clothingItemsOptions.map((option) => option.value),
    [],
  );
  const { checkedOptions, handleChange } = useMultiCheckboxQueryState(
    'clothing',
    allOptionValues,
  );

  console.log('CLOTHING RENDERED');

  return (
    <div className="grid grid-cols-2 gap-2.5 text-sm font-normal">
      {clothingItemsOptions.map((option) => (
        <Checkbox.Root
          key={option.value}
          name={option.label}
          value={option.value}
          className={buttonVariants({
            align: 'left',
            variant: 'secondary',
            roundness: 'lg',
            className:
              'py-2.5 data-[state=checked]:bg-primary-900 data-[state=checked]:text-primary-0',
          })}
          checked={checkedOptions.has(option.value)}
          onCheckedChange={(checked) => {
            if (checked === 'indeterminate') return;
            handleChange(checked, option.value);
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
