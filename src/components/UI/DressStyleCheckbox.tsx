'use client';

import { capitalize, cn } from '@/lib/util';
import * as Checkbox from '@radix-ui/react-checkbox';
import { useState } from 'react';

const dressStyles = [
  { id: 1, name: 'casual' },
  { id: 2, name: 'formal' },
  { id: 3, name: 'festival' },
  { id: 4, name: 'gym' },
];

const DressStyleCheckbox = () => {
  const [checkedStyles, setCheckedStyles] = useState(new Map<number, string>());

  return (
    <div>
      <div className="grid grid-cols-2 gap-2.5 text-sm font-medium text-black/60">
        {dressStyles.map((style) => (
          <Checkbox.Root
            key={style.id}
            name={style.name}
            id={`style-${style.name}`}
            className={cn(
              'rounded-lg border-none bg-black/5 px-3 py-2 text-left outline-none focus-visible:ring-2 focus-visible:ring-black',
              'hover:bg-black/10',
              'transition-all duration-200',
              'data-[state=checked]:bg-black data-[state=checked]:text-white data-[state=checked]:focus-visible:ring-offset-2 data-[state=checked]:focus-visible:ring-offset-white',
            )}
            checked={checkedStyles.has(style.id)}
            onCheckedChange={(checked) => {
              const checkedStylesCopy = new Map(checkedStyles);

              if (checked) {
                if (
                  [...checkedStylesCopy.keys()].length + 1 ===
                  dressStyles.length
                ) {
                  checkedStylesCopy.clear();
                } else checkedStylesCopy.set(style.id, style.name);
              } else checkedStylesCopy.delete(style.id);

              setCheckedStyles(checkedStylesCopy);
            }}
          >
            <label htmlFor={`style-${style.name}`} className="cursor-pointer">
              {capitalize(style.name)}
            </label>
          </Checkbox.Root>
        ))}
      </div>
    </div>
  );
};

export default DressStyleCheckbox;
