'use client';

import * as Slider from '@radix-ui/react-slider';
import { defaultPriceRange } from '@/lib/validation/constants';
import { useShopFilter } from '@/lib/hooks/useShopFilter';
import { useState } from 'react';

const PriceRangeSlider = () => {
  const rangeSlider = useShopFilter((store) => store.rangeSlider);

  const { currentRange, handleValueChange } = rangeSlider('price_range');
  const [currentRangeImmediate, setCurrentRangeImmediate] = useState<
    number[] | null
  >(null);

  const currentValue =
    currentRangeImmediate ?? currentRange ?? defaultPriceRange;

  const [min, max] = currentValue;

  return (
    <div>
      <Slider.Root
        className="relative mb-2 flex h-5 w-full touch-none select-none items-center"
        value={currentValue}
        min={defaultPriceRange[0]}
        max={defaultPriceRange[1]}
        step={1}
        onValueChange={(values) => setCurrentRangeImmediate(values)}
        onValueCommit={(values) => {
          handleValueChange(values);
          setCurrentRangeImmediate(null);
        }}
      >
        <Slider.Track className="relative h-1.5 grow cursor-pointer rounded-full bg-primary-50">
          <Slider.Range className="absolute h-full rounded-full bg-primary-900" />
        </Slider.Track>
        <Slider.Thumb
          className="block h-5 w-5 cursor-grab rounded-full bg-primary-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-primary-0"
          aria-label="Minimum Price"
        />
        <Slider.Thumb
          className="block h-5 w-5 cursor-grab rounded-full bg-primary-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-primary-0"
          aria-label="Maximum Price"
        />
      </Slider.Root>
      <div className="flex items-center justify-between gap-4 text-primary-400">
        <p>
          {new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0,
          }).format(min!)}
        </p>
        <p>
          {new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0,
          }).format(max!)}
        </p>
      </div>
    </div>
  );
};
export default PriceRangeSlider;
