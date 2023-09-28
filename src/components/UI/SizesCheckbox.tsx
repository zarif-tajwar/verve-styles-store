'use client';

import { capitalize, cn } from '@/lib/util';
import * as Checkbox from '@radix-ui/react-checkbox';
import { useState } from 'react';

const sizes = [
  { id: 1, name: 'small' },
  { id: 2, name: 'medium' },
  { id: 3, name: 'large' },
  { id: 4, name: 'xl' },
  { id: 5, name: '2xl' },
];

const SizesCheckbox = () => {
  const [checkedSizes, setCheckedSizes] = useState(new Map<number, string>());

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {sizes.map((size) => (
          <Checkbox.Root
            key={size.id}
            name={size.name}
            value={size.id}
            checked={checkedSizes.has(size.id)}
            onCheckedChange={(checked) => {
              const checkedSizesCopy = new Map(checkedSizes);

              if (checked) {
                if ([...checkedSizesCopy.keys()].length + 1 === sizes.length) {
                  checkedSizesCopy.clear();
                } else checkedSizesCopy.set(size.id, size.name);
              } else checkedSizesCopy.delete(size.id);

              setCheckedSizes(checkedSizesCopy);
            }}
            id={`size-${size.name}`}
            className={cn(
              'rounded-full border-none bg-offwhite px-5 py-1.5 text-sm font-medium text-black/60 outline-none',
              'focus-visible:ring-2 focus-visible:ring-black',
              'transition-all duration-200',
              'hover:bg-black/10',
              'data-[state=checked]:bg-black data-[state=checked]:text-white data-[state=checked]:focus-visible:ring-offset-2 data-[state=checked]:focus-visible:ring-offset-white',
            )}
          >
            <div>
              {size.name.length > 3
                ? capitalize(size.name)
                : size.name.toUpperCase()}
            </div>
          </Checkbox.Root>
        ))}
      </div>
    </div>
  );
};
export default SizesCheckbox;
