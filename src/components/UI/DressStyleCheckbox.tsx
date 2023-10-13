'use client';

import { useMultiCheckboxSearchQuery } from '@/lib/hooks/useMultiCheckboxSearchQuery';
import { cn } from '@/lib/util';
import {
  dressStylesColumnNames,
  dressStylesOptions,
} from '@/lib/validation/constants';
import * as Checkbox from '@radix-ui/react-checkbox';
import { Button, buttonVariants } from './Button';

const DressStyleCheckbox = () => {
  const { checkedOptions, handleCheck } = useMultiCheckboxSearchQuery({
    options: dressStylesColumnNames,
    searchQueryKey: 'styles',
  });

  return (
    <div>
      <div className="grid grid-cols-2 gap-2.5 text-sm font-medium text-black/60">
        {dressStylesOptions.map((style) => (
          <Checkbox.Root
            key={style.value}
            name={style.value}
            value={style.value}
            className={buttonVariants({
              align: 'left',
              variant: 'secondary',
              roundness: 'lg',
              className:
                'data-[state=checked]:bg-primary-900 data-[state=checked]:text-primary-0',
            })}
            checked={checkedOptions.has(style.value)}
            onCheckedChange={(checked) => handleCheck(checked, style.value)}
          >
            <div>{style.label}</div>
          </Checkbox.Root>
        ))}
      </div>
    </div>
  );
};

export default DressStyleCheckbox;
