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
      {sizesOptions.map((size) => (
        <Checkbox.Root
          key={size.value}
          name={size.value}
          value={size.value}
          checked={checkedOptions.has(size.value)}
          onCheckedChange={(checked) => {
            handleCheck(checked, size.value);
          }}
          className={buttonVariants({
            align: 'left',
            variant: 'secondary',
            roundness: 'default',
            className:
              'px-6 data-[state=checked]:bg-primary-900 data-[state=checked]:text-primary-0',
          })}
        >
          <div>{size.label}</div>
        </Checkbox.Root>
      ))}
    </div>
  );
};
export default SizesCheckbox;
