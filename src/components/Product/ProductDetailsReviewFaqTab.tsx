'use client';

import { cn, isValueInArray } from '@/lib/util';
import * as Tabs from '@radix-ui/react-tabs';
import { parseAsStringEnum, useQueryState } from 'nuqs';
import React, { useEffect } from 'react';
import WIP from '../UI/WIP';

const ProductDetails = () => (
  <div>
    <h2 className="font-inter text-2xl font-bold capitalize">
      Product Details
    </h2>
    <WIP />
  </div>
);
const ProductFAQs = () => (
  <div>
    <h2 className="font-inter text-2xl font-bold capitalize">FAQs</h2>
    <WIP />
  </div>
);

const TabOptions = [
  { value: 'detail', label: 'Product Details' },
  { value: 'review', label: 'Rating & Reviews' },
  { value: 'faq', label: 'FAQs' },
];

const values = TabOptions.map((o) => o.value);
const defaultValue = values.at(0)!;

const ProductDetailsReviewFaqTab = ({
  ReviewsComp,
}: {
  ReviewsComp: React.ReactNode;
}) => {
  const [tabValue, setTabValue] = useQueryState(
    'tab',
    parseAsStringEnum(values),
  );

  useEffect(() => {
    if (!isValueInArray(tabValue, values)) {
      setTabValue(null);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Tabs.Root
      value={tabValue || defaultValue}
      onValueChange={(v) => setTabValue(v === defaultValue ? null : v)}
    >
      <Tabs.List className="relative mb-8 grid w-full grid-cols-3 items-center justify-between">
        {TabOptions.map((tabOption) => (
          <Tabs.Trigger
            key={tabOption.value}
            value={tabOption.value}
            className={cn(
              'text-cneter group relative py-6 text-lg text-primary-400',
              'data-[state=active]:font-semibold data-[state=active]:text-primary-900',
              'transition-all duration-100',
              'hover:text-primary-500',
            )}
          >
            {tabOption.label}
            <span
              className={cn(
                'absolute -bottom-0.5 block h-0.5 w-full bg-primary-50',
                'group-data-[state=active]:bg-primary-400',
                'group-hover:bg-primary-100',
                'transition-colors duration-200',
              )}
            />
          </Tabs.Trigger>
        ))}
      </Tabs.List>
      <Tabs.TabsContent value={'detail'} key={'detail'}>
        <ProductDetails />
      </Tabs.TabsContent>
      <Tabs.TabsContent value={'review'} key={'review'}>
        {ReviewsComp}
      </Tabs.TabsContent>
      <Tabs.TabsContent value={'faq'} key={'faq'}>
        <ProductFAQs />
      </Tabs.TabsContent>
    </Tabs.Root>
  );
};

export default ProductDetailsReviewFaqTab;
