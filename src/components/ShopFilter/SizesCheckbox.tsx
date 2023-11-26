'use client';

import { cn } from '@/lib/util';
import * as Checkbox from '@radix-ui/react-checkbox';
import { sizesOptions } from '@/lib/validation/constants';
import { buttonVariants } from '../UI/Button';
import { useMultiCheckboxQueryState } from '@/lib/hooks/shop-filter-hooks';
import { useMemo } from 'react';

const SizesCheckbox = () => {
  const allOptionValues = useMemo(
    () => sizesOptions.map((option) => option.value),
    [],
  );
  const { checkedOptions, handleChange } = useMultiCheckboxQueryState(
    'sizes',
    allOptionValues,
  );

  console.log('SIZES RENDERED');

  return (
    <div className="flex flex-wrap gap-2">
      {sizesOptions.map((option) => (
        <Checkbox.Root
          key={option.value}
          name={option.value}
          value={option.value}
          checked={checkedOptions.has(option.value)}
          onCheckedChange={(checked) => {
            if (checked === 'indeterminate') return;
            handleChange(checked, option.value);
          }}
          className={buttonVariants({
            align: 'left',
            variant: 'secondary',
            roundness: 'default',
            className:
              'px-6 data-[state=checked]:bg-primary-900 data-[state=checked]:text-primary-0',
          })}
        >
          <div>{option.label}</div>
        </Checkbox.Root>
      ))}
    </div>
  );
};
export default SizesCheckbox;
