'use client';

import { cn } from '@/lib/util';
import * as Checkbox from '@radix-ui/react-checkbox';
import { useMultiCheckboxSearchQuery } from '../../lib/hooks/useMultiCheckboxSearchQuery';

const sizes = [
  { id: 1, value: 'sm', label: 'Small' },
  { id: 2, value: 'md', label: 'Medium' },
  { id: 3, value: 'lg', label: 'Large' },
  { id: 4, value: 'xl', label: 'XL' },
  { id: 5, value: '2xl', label: '2XL' },
];

const SizesCheckbox = () => {
  const { isChecked, handleCheck } = useMultiCheckboxSearchQuery({
    options: sizes,
    searchQueryKey: 'sizes',
  });

  return (
    <div className="flex flex-wrap gap-2">
      {sizes.map((size) => (
        <Checkbox.Root
          key={size.value}
          name={size.value}
          value={size.value}
          checked={isChecked(size.value)}
          onCheckedChange={(checked) => {
            handleCheck(checked, size.value, false);
          }}
          className={cn(
            'rounded-full border-none bg-offwhite px-5 py-1.5 text-sm font-medium text-black/60 outline-none',
            'focus-visible:ring-2 focus-visible:ring-black',
            'transition-all duration-200',
            'hover:bg-black/10',
            'data-[state=checked]:bg-black data-[state=checked]:text-white data-[state=checked]:focus-visible:ring-offset-2 data-[state=checked]:focus-visible:ring-offset-white',
          )}
        >
          <div>{size.label}</div>
        </Checkbox.Root>
      ))}
    </div>
  );
};
export default SizesCheckbox;
