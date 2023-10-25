'use client';

import { cn } from '@/lib/util';
import * as Checkbox from '@radix-ui/react-checkbox';
import { useMultiCheckboxSearchQuery } from '../../lib/hooks/useMultiCheckboxSearchQuery';
import { sizesColumnNames, sizesOptions } from '@/lib/validation/constants';
import { buttonVariants } from './Button';

const SizesCheckbox = () => {
  const { checkedOptions, handleCheck } = useMultiCheckboxSearchQuery({
    options: sizesColumnNames,
    searchQueryKey: 'sizes',
  });

  return (
    <div className="flex flex-wrap gap-2">
      {sizesOptions.map((option) => (
        <Checkbox.Root
          key={option.value}
          name={option.value}
          value={option.value}
          checked={checkedOptions.has(option.value)}
          onCheckedChange={(checked) => {
            handleCheck(checked, option.value);
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
