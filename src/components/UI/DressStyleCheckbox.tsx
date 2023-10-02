'use client';

import useQueryParams from '@/lib/hooks/useQueryParams';
import { capitalize, cn } from '@/lib/util';
import * as Checkbox from '@radix-ui/react-checkbox';
import { useState } from 'react';

const dressStyles = [
  { id: 1, value: 'casual', label: 'Casual' },
  { id: 2, value: 'formal', label: 'Formal' },
  { id: 3, value: 'festival', label: 'Festival' },
  { id: 4, value: 'gym', label: 'Gym' },
];

const DressStyleCheckbox = () => {
  const { queryParams, setQueryParams } = useQueryParams<{
    styles?: string;
  }>();
  const selectedStyles = new Map<number, string>();

  queryParams
    .get('styles')
    ?.split('~')
    .forEach((value) => {
      const id = dressStyles.find((item) => item.value === value)?.id;
      if (id || id === 0) selectedStyles.set(id, value);
    });

  if (selectedStyles.size === dressStyles.length) {
    selectedStyles.clear();
    setQueryParams({ styles: '' });
  }

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
            checked={selectedStyles.has(style.id)}
            onCheckedChange={(checked) => {
              if (checked) {
                if (selectedStyles.size + 1 === dressStyles.length) {
                  selectedStyles.clear();
                  setQueryParams({ styles: '' });
                  return;
                } else selectedStyles.set(style.id, style.value);
              }
              if (!checked) {
                selectedStyles.delete(style.id);
              }

              const values = Array.from(selectedStyles)
                .toSorted((a, b) => a[0] - b[0])
                .map((item) => item[1]);

              setQueryParams({
                styles: values.join('~'),
              });
            }}
          >
            <div>{style.label}</div>
          </Checkbox.Root>
        ))}
      </div>
    </div>
  );
};

export default DressStyleCheckbox;
