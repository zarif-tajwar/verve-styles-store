'use client';

import * as Checkbox from '@radix-ui/react-checkbox';
import { useMultiCheckboxSearchQuery } from '@/lib/hooks/useMultiCheckboxSearchQuery';
import {
  clothingColumnNames,
  clothingItemsOptions,
} from '@/lib/validation/constants';
import { buttonVariants } from '../UI/Button';

const ClothingCheckbox = () => {
  const { checkedOptions, handleCheck } = useMultiCheckboxSearchQuery({
    options: clothingColumnNames,
    searchQueryKey: 'clothing',
  });

  return (
    <div className="grid grid-cols-2 gap-2.5 text-sm">
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
