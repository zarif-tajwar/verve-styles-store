'use client';

import { cn } from '@/lib/util';
import { Icons } from '../Svgs/icons';
import * as Checkbox from '@radix-ui/react-checkbox';
import { useMultiCheckboxSearchQuery } from '@/lib/hooks/useMultiCheckboxSearchQuery';
import {
  clothingColumnNames,
  clothingItemsOptions,
} from '@/lib/validation/constants';
import { buttonVariants } from './Button';

const ClothingCheckbox = () => {
  const { checkedOptions, handleCheck } = useMultiCheckboxSearchQuery({
    options: clothingColumnNames,
    searchQueryKey: 'clothing',
  });

  return (
    <div className="grid grid-cols-2 gap-2.5 text-sm">
      {clothingItemsOptions.map((clothing) => (
        <Checkbox.Root
          key={clothing.value}
          name={clothing.label}
          value={clothing.value}
          className={buttonVariants({
            align: 'left',
            variant: 'secondary',
            roundness: 'lg',
            className:
              'py-2.5 data-[state=checked]:bg-primary-900 data-[state=checked]:text-primary-0',
          })}
          checked={checkedOptions.has(clothing.value)}
          onCheckedChange={(checked) => {
            handleCheck(checked, clothing.value);
          }}
        >
          <clothing.icon className="h-[18px]" />
          <div>{clothing.label}</div>
        </Checkbox.Root>
      ))}
    </div>
  );
};
export default ClothingCheckbox;
