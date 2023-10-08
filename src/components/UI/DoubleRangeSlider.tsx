'use client';

import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import * as Slider from '@radix-ui/react-slider';
import useQueryParams from '@/lib/hooks/useQueryParams';
import { defaultPriceRange } from '@/lib/validation/constants';
import { zParsePriceRangeSearchQuery } from '@/lib/validation/schemas';

const DoubleRangeSlider = () => {
  const { queryParams, setQueryParams } = useQueryParams<{
    price_range: string;
  }>();
  const [priceRangeValues, setPriceRangeValues] = useState(defaultPriceRange);
  const isMounted = useRef(false);

  const isNoSearchParam = queryParams.get('price_range') === null;

  useEffect(() => {
    isMounted.current = true;

    const priceRangeValuesFromUrl = queryParams.get('price_range');

    const validate = zParsePriceRangeSearchQuery().safeParse(
      priceRangeValuesFromUrl,
    );

    if (validate.success) {
      const { data } = validate;
      if (!data) {
        setPriceRangeValues(defaultPriceRange);
      } else {
        setPriceRangeValues(data);
      }
    }

    return () => {
      isMounted.current = false;
    };
  }, []); //eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (isNoSearchParam && isMounted) {
      setPriceRangeValues(defaultPriceRange);
    }
  }, [isNoSearchParam]); //eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div>
      <Slider.Root
        className="relative mb-2 flex h-5 w-full touch-none select-none items-center"
        value={priceRangeValues}
        min={defaultPriceRange[0]}
        max={defaultPriceRange[1]}
        step={1}
        onValueChange={(values) => setPriceRangeValues(values)}
        onValueCommit={(values) => {
          if (
            values[0] === defaultPriceRange[0] &&
            values[1] === defaultPriceRange[1]
          ) {
            setQueryParams({ price_range: '' });
          } else {
            setQueryParams({ price_range: values.join('-') });
          }
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
        <p>${priceRangeValues[0]}</p>
        <p>${priceRangeValues[1]}</p>
      </div>
    </div>
  );
};
export default DoubleRangeSlider;
