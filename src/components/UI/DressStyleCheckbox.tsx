'use client';

import { useMultiCheckboxSearchQuery } from '@/lib/hooks/useMultiCheckboxSearchQuery';
import { cn } from '@/lib/util';
import * as Checkbox from '@radix-ui/react-checkbox';

const dressStyles = [
  { id: 1, value: 'casual', label: 'Casual' },
  { id: 2, value: 'formal', label: 'Formal' },
  { id: 3, value: 'festival', label: 'Festival' },
  { id: 4, value: 'gym', label: 'Gym' },
];

const DressStyleCheckbox = () => {
  const { checkedOptions, handleCheck } = useMultiCheckboxSearchQuery({
    options: dressStyles,
    searchQueryKey: 'styles',
  });

  return (
    <div>
      <div className="grid grid-cols-2 gap-2.5 text-sm font-medium text-black/60">
        {dressStyles.map((style) => (
          <Checkbox.Root
            key={style.value}
            name={style.value}
            value={style.value}
            className={cn(
              'rounded-lg border-none bg-black/5 px-3 py-2 text-left outline-none focus-visible:ring-2 focus-visible:ring-black',
              'hover:bg-black/10',
              'transition-all duration-200',
              'data-[state=checked]:bg-black data-[state=checked]:text-white data-[state=checked]:focus-visible:ring-offset-2 data-[state=checked]:focus-visible:ring-offset-white',
            )}
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
