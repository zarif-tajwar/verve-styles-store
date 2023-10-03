'use client';

import React, { useCallback, useEffect, useState } from 'react';
import * as Select from '@radix-ui/react-select';
import { ChevronDownIcon } from '@radix-ui/react-icons';
import { cn } from '@/lib/util';
import useQueryParams from '@/lib/hooks/useQueryParams';

// const sortOptions = [
//   { value: 'most-recent', title: 'Most Recent' },
//   { value: 'most-popular', title: 'Most Popular' },
//   { value: 'price-low-to-high', title: 'Price (Low to High)' },
//   { value: 'price-high-to-low', title: 'Price (High to Low)' },
// ];

// const defaultOptionValue = sortOptions[0].value;

// const SortBySelect = () => {
//   return (
//     <div className="flex flex-col items-end gap-1">
//       <span className="mr-1 inline-block pr-3 text-sm text-black/60">
//         Sort By
//       </span>
//       <SelectMain />
//     </div>
//   );
// };
// export default SortBySelect;

export const useSelectSearchQuery = ({
  defaultOptionValue,
  searchQueryKey,
  options,
}: {
  defaultOptionValue: string;
  searchQueryKey: string;
  options: string[];
}) => {
  const { queryParams, setQueryParams } = useQueryParams();

  const getOptionValue = () => queryParams.get(searchQueryKey);

  useEffect(() => {
    const urlOptionValue = getOptionValue();

    if (!urlOptionValue) return;

    if (
      urlOptionValue === defaultOptionValue ||
      !options.some((option) => option === urlOptionValue)
    )
      setQueryParams({ [searchQueryKey]: '' });
  }, []); //eslint-disable-line react-hooks/exhaustive-deps

  const handleValueChange = useCallback(
    (value: string) => {
      setQueryParams({
        [searchQueryKey]: value === defaultOptionValue ? '' : value,
      });
    },
    [queryParams], //eslint-disable-line react-hooks/exhaustive-deps
  );

  return { getOptionValue, handleValueChange };
};
