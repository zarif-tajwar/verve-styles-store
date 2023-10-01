'use client';

import { useState } from 'react';
import * as Slider from '@radix-ui/react-slider';
import { useSearchParams } from 'next/navigation';
import useQueryParams from '@/lib/hooks/useQueryParams';

const defaultRange = [0, 10000];

const DoubleRangeSlider = () => {
  // const searchParams = useSearchParams();
  // const price = searchParams.get('price')?.split(',').map(Number);
  const { queryParams, setQueryParams } = useQueryParams<{ price?: string }>();
  const price = queryParams.get('price')?.split('-').map(Number);

  const [rangeValues, setRangeValues] = useState<number[]>(
    price || defaultRange,
  );

  return (
    <div>
      <Slider.Root
        className="relative mb-2 flex h-5 w-full touch-none select-none items-center"
        // defaultValue={price}
        value={rangeValues}
        min={defaultRange[0]}
        max={defaultRange[1]}
        step={1}
        // onValueChange={(values) => setRangeValues(values)}
        onValueChange={(values) => setRangeValues(values)}
        onValueCommit={(values) => setQueryParams({ price: values.join('-') })}
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
      <button onClick={() => console.log(price)}>Click Me</button>
    </div>
  );
};
export default DoubleRangeSlider;
