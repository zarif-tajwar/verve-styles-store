'use client';

import { useShopFilter } from '@/lib/hooks/useShopFilter';
import { cn, priceFormat } from '@/lib/util';
import React, { useMemo } from 'react';

const Badge = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <span
      className={cn(
        'inline-flex min-w-11 items-center justify-center rounded-full border border-primary-100 px-2 py-0.5 text-xs font-medium text-primary-400',
        className,
      )}
    >
      {children}
    </span>
  );
};

const FilterSelectedTags = () => {
  const queryStates = useShopFilter((store) => store.queryStates);
  const isAnyFiltersActive =
    useShopFilter((store) => store.filterParamsSerialized) !== '';

  if (!isAnyFiltersActive) return null;

  return (
    <div className="mb-6 grid gap-2 lg:hidden">
      <p className="text-sm text-primary-400">Selected Filters</p>
      <div className="-ml-2 flex flex-wrap items-center gap-1.5">
        {queryStates.sort_by && <Badge>{queryStates.sort_by}</Badge>}
        {queryStates.clothing?.map((value) => {
          return <Badge key={value}>{value}</Badge>;
        })}
        {queryStates.styles?.map((value) => {
          return <Badge key={value}>{value}</Badge>;
        })}
        {queryStates.sizes?.map((value) => {
          return <Badge key={value}>{value}</Badge>;
        })}
        {queryStates.price_range && (
          <>
            <Badge>{`${priceFormat(queryStates.price_range.at(0)!)}-${priceFormat(queryStates.price_range.at(1)!)}`}</Badge>
          </>
        )}
      </div>
    </div>
  );
};
export default FilterSelectedTags;
