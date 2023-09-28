'use client';

import { useState } from 'react';
import * as Slider from '@radix-ui/react-slider';

const defaultRange = [0, 10000];

const DoubleRangeSlider = () => {
  const [rangeValues, setRangeValues] = useState<number[]>(defaultRange);

  return (
    <div>
      <Slider.Root
        className="relative mb-2 flex h-5 w-full touch-none select-none items-center"
        defaultValue={defaultRange}
        value={rangeValues}
        min={defaultRange[0]}
        max={defaultRange[1]}
        step={1}
        onValueChange={(values) => setRangeValues(values)}
      >
        <Slider.Track className="relative h-1.5 grow rounded-full bg-offwhite">
          <Slider.Range className="absolute h-full rounded-full bg-black" />
        </Slider.Track>
        <Slider.Thumb
          className="block h-5 w-5 rounded-full bg-black focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 focus:ring-offset-white"
          aria-label="Minimum Price"
        />
        <Slider.Thumb
          className="block h-5 w-5 rounded-full bg-black focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 focus:ring-offset-white"
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
