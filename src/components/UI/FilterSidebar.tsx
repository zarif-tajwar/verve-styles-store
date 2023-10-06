'use client';

import { useEffect, useState } from 'react';
import { Icons } from '../Svgs/icons';
import ClothingCheckbox from './ClothingCheckbox';
import DoubleRangeSlider from './DoubleRangeSlider';
import DressStyleCheckbox from './DressStyleCheckbox';
import SizesCheckbox from './SizesCheckbox';
import { FilterSearchQueryValuesSchema } from '@/lib/validation/schemas';
import useQueryParams from '@/lib/hooks/useQueryParams';
import { defaultPriceRange } from '@/lib/validation/constants';

export const FilterSidebar = () => {
  const [priceRangeValues, setPriceRangeValues] = useState(defaultPriceRange);
  const { queryParams, setQueryParams } = useQueryParams();
  useEffect(
    () => {
      if (queryParams.size === 0) return;

      const queryParamsObject = Object.fromEntries(queryParams.entries());

      const parseSearchParams =
        FilterSearchQueryValuesSchema.safeParse(queryParamsObject);

      if (parseSearchParams.success) {
        const { clothing, sizes, sort_by, styles, price_range } =
          parseSearchParams.data;

        setQueryParams({
          clothing: clothing?.join('~'),
          sizes: sizes?.join('~'),
          styles: styles?.join('~'),
          price_range: price_range?.join('-'),
          sort_by,
        });

        setPriceRangeValues(price_range ? price_range : defaultPriceRange);
      }
    },
    [], //eslint-disable-line react-hooks/exhaustive-deps
  );

  return (
    <div className="w-full max-w-[296px]">
      <div className="rounded-main border border-black/10 px-6 pb-8 pt-8">
        <div className="flex items-center justify-between">
          <h2 className="font-plus-jakarta-sans text-xl font-bold capitalize">
            Filters
          </h2>
          <Icons.filter className="text-black/40" />
        </div>
        <VerticalDivider />
        <h3 className="mb-4 font-plus-jakarta-sans font-bold capitalize">
          Clothing
        </h3>
        <ClothingCheckbox />

        <VerticalDivider />
        <h3 className="mb-4 font-plus-jakarta-sans font-bold capitalize">
          Price
        </h3>
        <DoubleRangeSlider
          priceRangeValues={priceRangeValues}
          setPriceRangeValues={setPriceRangeValues}
        />
        <VerticalDivider />
        <h3 className="mb-4 font-plus-jakarta-sans font-bold capitalize">
          Size
        </h3>
        <SizesCheckbox />
        <VerticalDivider />
        <h3 className="mb-4 font-plus-jakarta-sans font-bold capitalize">
          Dress Style
        </h3>
        <DressStyleCheckbox />
      </div>
    </div>
  );
};

const VerticalDivider = () => (
  <div className="my-6 h-px w-full bg-black/10"></div>
);
