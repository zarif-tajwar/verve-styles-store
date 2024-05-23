'use client';

import * as Checkbox from '@radix-ui/react-checkbox';
import { clothingItemsOptions } from '@/lib/validation/constants';
import { buttonVariants } from '../UI/Button';
import { useShopFilter } from '@/lib/hooks/useShopFilter';
import { useTransition } from 'react';

const ClothingCheckbox = () => {
  const multipleOptionCheck = useShopFilter(
    (store) => store.multipleOptionCheck,
  );
  const { checkedValues, handleCheck } = multipleOptionCheck('clothing');

  console.log('Clothing re-rended');

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
          checked={!!checkedValues?.includes(option.value)}
          onCheckedChange={(checked) => {
            if (checked === 'indeterminate') return;
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
