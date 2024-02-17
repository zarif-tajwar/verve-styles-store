'use client';

import { useShopFilter } from '@/lib/hooks/useShopFilter';
import { sizesOptions } from '@/lib/validation/constants';
import * as Checkbox from '@radix-ui/react-checkbox';
import { buttonVariants } from '../UI/Button';

const SizesCheckbox = () => {
  const multipleOptionCheck = useShopFilter(
    (store) => store.multipleOptionCheck,
  );
  const { checkedValues, handleCheck } = multipleOptionCheck('sizes');

  return (
    <div className="flex flex-wrap gap-2">
      {sizesOptions.map((option) => (
        <Checkbox.Root
          key={option.value}
          name={option.value}
          value={option.value}
          checked={!!checkedValues?.includes(option.value)}
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
