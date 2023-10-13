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
              'data-[state=checked]:bg-primary-900 data-[state=checked]:text-primary-0',
          })}
          // className={cn(
          //   'flex items-center gap-1 rounded-lg border-none bg-black/5 px-2 py-2 font-medium text-black/60 outline-none transition-all duration-200',
          //   'hover:bg-black/10',
          //   'focus-visible:ring-2 focus-visible:ring-black',
          //   'data-[state=checked]:bg-black data-[state=checked]:text-white data-[state=checked]:focus-visible:ring-offset-2 data-[state=checked]:focus-visible:ring-offset-white',
          // )}
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
