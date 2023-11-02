'use client';

import { useShopFilterStore } from '@/lib/store/shop-filter';
import ClothingCheckbox from './ClothingCheckbox';
import DoubleRangeSlider from './DoubleRangeSlider';
import DressStyleCheckbox from './DressStyleCheckbox';
import SizesCheckbox from './SizesCheckbox';
import { useEffect } from 'react';
import {
  FilterSearchQueryValuesSchema,
  FilterSearchQueryValuesType,
} from '@/lib/validation/schemas';
import useQueryParams from '@/lib/hooks/useQueryParams';
import {
  PriceRange,
  ShopFilterQueryParams,
  ShopFilterState,
} from '@/lib/types/ShopFilter';
import { URL_QUERY_SEPERATORS } from '@/lib/validation/constants';
import { Sliders } from 'lucide-react';

export const FilterSidebar = () => {
  const updateFilterState = useShopFilterStore((store) => store.update);
  const { queryParams, setQueryParams } =
    useQueryParams<ShopFilterQueryParams>();

  useEffect(
    () => {
      if (queryParams.size === 0) return;

      const searchParamsEntries = Object.fromEntries(queryParams.entries());

      const parsedParamsInstance =
        FilterSearchQueryValuesSchema.safeParse(searchParamsEntries);

      if (parsedParamsInstance.success) {
        const { data } = parsedParamsInstance;
        const dataKeys = Object.keys(
          data,
        ) as (keyof FilterSearchQueryValuesType)[];

        const validStatesFromUrl: Partial<ShopFilterState> = {};
        const validatedSearchParams: ShopFilterQueryParams = {};

        for (const key of dataKeys) {
          if (data[key] === undefined || data[key] === null) {
            validatedSearchParams[key] = undefined;
            continue;
          }

          if (key === 'sort_by') {
            validStatesFromUrl[key] = data[key];
            validatedSearchParams[key] = data[key];
            continue;
          }

          if (key === 'price_range') {
            validStatesFromUrl[key] = data[key] as PriceRange;
            validatedSearchParams[key] = data[key]?.join(
              URL_QUERY_SEPERATORS.range,
            );
            continue;
          }

          if (key === 'clothing' || key === 'sizes' || key === 'styles') {
            validStatesFromUrl[key] = new Set(data[key]);
            validatedSearchParams[key] = data[key]?.join(
              URL_QUERY_SEPERATORS.multipleOption,
            );
            continue;
          }
        }

        updateFilterState(validStatesFromUrl);
        setQueryParams(validatedSearchParams);
      } else {
        console.error(
          'Filters Component Initial Values Error:',
          parsedParamsInstance.error,
        );
      }
    },
    [], // eslint-disable-line react-hooks/exhaustive-deps
  );

  return (
    <div className="sticky top-20 h-max">
      <div className="w-max max-w-[18.5rem]">
        <div className="rounded-main border border-primary-100 px-6 pb-8 pt-8">
          <div className="flex items-center justify-between">
            <h2 className="font-geist text-xl font-semibold capitalize">
              Filters
            </h2>
            <Sliders size={20} className="text-primary-400" />
          </div>
          <VerticalDivider />
          <h3 className="mb-4 font-semibold capitalize">Clothing</h3>
          <ClothingCheckbox />

          <VerticalDivider />
          <h3 className="mb-4 font-semibold capitalize">Price</h3>
          <DoubleRangeSlider />
          <VerticalDivider />
          <h3 className="mb-4 font-semibold capitalize">Size</h3>
          <SizesCheckbox />
          <VerticalDivider />
          <h3 className="mb-4 font-semibold capitalize">Dress Style</h3>
          <DressStyleCheckbox />
        </div>
      </div>
    </div>
  );
};

const VerticalDivider = () => (
  <div className="my-6 h-px w-full bg-primary-100"></div>
);
