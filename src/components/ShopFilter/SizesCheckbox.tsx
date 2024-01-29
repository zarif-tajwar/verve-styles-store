'use client';

import { cn } from '@/lib/util';
import * as Checkbox from '@radix-ui/react-checkbox';
import { sizesOptions } from '@/lib/validation/constants';
import { buttonVariants } from '../UI/Button';
import { useShopFilter } from '@/lib/hooks/useShopFilter';

const SizesCheckbox = () => {
  const multipleOptionCheck = useShopFilter(
    (store) => store.multipleOptionCheck,
  );

  const { checkedOptions, handleCheck } = multipleOptionCheck(
    sizesOptions.map((x) => x.value),
    'sizes',
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
            handleCheck(checked, option.value);
          }}
          className={buttonVariants({
            align: 'left',
            variant: 'secondary',
            roundness: 'default',
            className:
              'px-6 py-1.5 data-[state=checked]:bg-primary-900 data-[state=checked]:text-primary-0',
          })}
        >
          <div>{option.label}</div>
        </Checkbox.Root>
      ))}
    </div>
  );
};
export default SizesCheckbox;
