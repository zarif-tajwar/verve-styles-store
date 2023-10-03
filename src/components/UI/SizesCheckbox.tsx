'use client';

import useQueryParams from '@/lib/hooks/useQueryParams';
import { capitalize, cn } from '@/lib/util';
import * as Checkbox from '@radix-ui/react-checkbox';
import { useEffect, useState } from 'react';

const sizes = [
  { id: 1, value: 'sm', label: 'Small' },
  { id: 2, value: 'md', label: 'Medium' },
  { id: 3, value: 'lg', label: 'Large' },
  { id: 4, value: 'xl', label: 'XL' },
  { id: 5, value: '2xl', label: '2XL' },
];

const sizesValues = sizes.map((option) => option.value);

const SizesCheckbox = () => {
  const { queryParams, setQueryParams } = useQueryParams<{
    sizes?: string;
  }>(false);

  const getParamsArray = () => queryParams.get('sizes')?.split('~');
  const stringifyParamsArray = (params: string[]) => params.join('~');

  useEffect(() => {
    const params = getParamsArray();

    if (!params) return;

    // checking if url search param has supported values
    if (
      params.some(
        (paramValue) =>
          !sizesValues.find((sizeValue) => sizeValue === paramValue),
      ) ||
      params.length === sizesValues.length
    ) {
      setQueryParams({ sizes: '' });
      return;
    }
  }, []); //eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {sizes.map((size) => (
          <Checkbox.Root
            key={size.value}
            name={size.value}
            value={size.value}
            checked={Boolean(
              getParamsArray()?.find((paramValue) => paramValue === size.value),
            )}
            onCheckedChange={(checked) => {
              const params = new Set(getParamsArray());

              if (checked) {
                if (params.size + 1 === sizesValues.length) {
                  params.clear();
                } else {
                  params.add(size.value);
                }
              }

              if (!checked) {
                params.delete(size.value);
              }

              const newParams = Array.from(params).toSorted(
                (a, b) =>
                  sizes.find((sizeOption) => a === sizeOption.value)?.id! -
                  sizes.find((sizeOption) => b === sizeOption.value)?.id!,
              );

              setQueryParams({ sizes: stringifyParamsArray(newParams) });
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
