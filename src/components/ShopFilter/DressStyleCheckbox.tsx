'use client';

import { cn } from '@/lib/util';
import { dressStylesOptions } from '@/lib/validation/constants';
import * as Checkbox from '@radix-ui/react-checkbox';
import { buttonVariants } from '../UI/Button';
import { useMultiCheckboxQueryState } from '@/lib/hooks/shop-filter-hooks';
import { useMemo } from 'react';

const DressStyleCheckbox = () => {
  const allOptionValues = useMemo(
    () => dressStylesOptions.map((option) => option.value),
    [],
  );
  const { checkedOptions, handleChange } = useMultiCheckboxQueryState(
    'styles',
    allOptionValues,
  );

  console.log('STYLE RENDERED');

  return (
    <div>
      <div className="grid grid-cols-2 gap-2.5 text-black/60">
        {dressStylesOptions.map((option) => (
          <Checkbox.Root
            key={option.value}
            name={option.value}
            value={option.value}
            className={buttonVariants({
              align: 'left',
              variant: 'secondary',
              roundness: 'lg',
              className:
                'data-[state=checked]:bg-primary-900 data-[state=checked]:text-primary-0',
            })}
            checked={checkedOptions.has(option.value)}
            onCheckedChange={(checked) => {
              if (checked === 'indeterminate') return;
              handleChange(checked, option.value);
            }}
          >
            <div>{option.label}</div>
          </Checkbox.Root>
        ))}
      </div>
    </div>
  );
};

export default DressStyleCheckbox;
