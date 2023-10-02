'use client';

import useQueryParams from '@/lib/hooks/useQueryParams';
import { capitalize, cn } from '@/lib/util';
import * as Checkbox from '@radix-ui/react-checkbox';
import { useState } from 'react';

const sizes = [
  { id: 1, value: 'sm', label: 'Small' },
  { id: 2, value: 'md', label: 'Medium' },
  { id: 3, value: 'lg', label: 'Large' },
  { id: 4, value: 'xl', label: 'XL' },
  { id: 5, value: '2xl', label: '2XL' },
];

const SizesCheckbox = () => {
  const { queryParams, setQueryParams } = useQueryParams<{
    sizes?: string;
  }>();
  const selectedSizes = new Map<number, string>();

  queryParams
    .get('sizes')
    ?.split('~')
    .forEach((value) => {
      const id = sizes.find((item) => item.value === value)?.id;
      if (id || id === 0) selectedSizes.set(id, value);
    });

  if (selectedSizes.size === sizes.length) {
    selectedSizes.clear();
    setQueryParams({ sizes: '' });
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {sizes.map((size) => (
          <Checkbox.Root
            key={size.value}
            name={size.value}
            value={size.value}
            checked={selectedSizes.has(size.id)}
            onCheckedChange={(checked) => {
              if (checked) {
                if (selectedSizes.size + 1 === sizes.length) {
                  selectedSizes.clear();
                  setQueryParams({ sizes: '' });
                  return;
                } else selectedSizes.set(size.id, size.value);
              }
              if (!checked) {
                selectedSizes.delete(size.id);
              }

              const values = Array.from(selectedSizes)
                .toSorted((a, b) => a[0] - b[0])
                .map((item) => item[1]);

              setQueryParams({
                sizes: values.join('~'),
              });
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
    </div>
  );
};
export default SizesCheckbox;
