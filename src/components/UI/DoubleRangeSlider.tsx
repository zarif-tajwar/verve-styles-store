'use client';

import { useState } from 'react';
import * as Slider from '@radix-ui/react-slider';
import { useSearchParams } from 'next/navigation';
import useQueryParams from '@/lib/hooks/useQueryParams';

type PriceRange = [number, number];

const defaultRange: PriceRange = [0, 10000];

const DoubleRangeSlider = () => {
  const { queryParams, setQueryParams } = useQueryParams<{
    price_range?: string;
  }>();

  const priceQueryParam = queryParams
    .get('price_range')
    ?.split('-')
    .map(Number);

  if (
    priceQueryParam &&
    priceQueryParam[0] === defaultRange[0] &&
    priceQueryParam[1] === defaultRange[1]
  ) {
    setQueryParams({ price_range: '' });
  }

  const [rangeValues, setRangeValues] = useState<PriceRange>(
    (priceQueryParam as PriceRange) || defaultRange,
  );

  return (
    <div>
      <Slider.Root
        className="relative mb-2 flex h-5 w-full touch-none select-none items-center"
        value={rangeValues}
        min={defaultRange[0]}
        max={defaultRange[1]}
        step={1}
        onValueChange={(values) => setRangeValues(values as PriceRange)}
        onValueCommit={(values) => {
          if (values[0] === defaultRange[0] && values[1] === defaultRange[1]) {
            setQueryParams({ price_range: '' });
          } else setQueryParams({ price_range: values.join('-') });
        }}
      >
        <Slider.Track className="relative h-1.5 grow cursor-pointer rounded-full bg-offwhite">
          <Slider.Range className="absolute h-full rounded-full bg-black" />
        </Slider.Track>
        <Slider.Thumb
          className="block h-5 w-5 cursor-grab rounded-full bg-black focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 focus:ring-offset-white"
          aria-label="Minimum Price"
        />
        <Slider.Thumb
          className="block h-5 w-5 cursor-grab rounded-full bg-black focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 focus:ring-offset-white"
          aria-label="Maximum Price"
        />
      </Slider.Root>
      <div className="flex items-center justify-between gap-4 font-medium">
        <p>${rangeValues[0]}</p>
        <p>${rangeValues[1]}</p>
      </div>
    </div>
  );
};
export default DoubleRangeSlider;
