'use client';

import { cn, isValueInArray } from '@/lib/util';
import * as Tabs from '@radix-ui/react-tabs';
import { parseAsStringEnum, useQueryState } from 'nuqs';
import React, { useCallback, useEffect } from 'react';
import WIP from '../UI/WIP';
import { Button } from '../UI/Button';
import { Container } from '../UI/Container';

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
] as const;

const values = TabOptions.map((o) => o.value);

type Value = (typeof values)[number];

const defaultValue = values.at(0)!;

const ProductDetailsReviewFaqTab = ({
  ReviewsComp,
}: {
  ReviewsComp: React.ReactNode;
}) => {
  const [tabValue, setTabValue] = useQueryState(
    'view',
    parseAsStringEnum(values),
  );

  const handleValueChange = useCallback(
    (value: Value) => {
      setTabValue(value === defaultValue ? null : value);
    },
    [setTabValue],
  );

  return (
    <Tabs.Root
      value={tabValue || defaultValue}
      onValueChange={(value) => handleValueChange(value as Value)}
    >
      <Container className="px-2">
        <Tabs.List className="relative mb-8 grid w-full gap-1 rounded-lg border border-primary-50 p-1 sm:gap-2 sm:p-2 md:rounded-xl [@media(width>=500px)]:grid-cols-3">
          {TabOptions.map((tabOption) => {
            const isSelected = tabValue
              ? tabValue === tabOption.value
              : defaultValue === tabOption.value;

            return (
              <Tabs.Trigger
                key={tabOption.value}
                value={tabOption.value}
                className={cn(
                  'center relative inline-flex items-center justify-center rounded-lg px-4 py-3 text-left text-sm font-semibold text-primary-400 transition-colors duration-200 hover:bg-primary-50 sm:text-base md:rounded-xl md:py-4 lg:py-5 lg:text-lg',
                  // 'border-b-2 border-primary-50',
                  // tabValue === tabOption.value && 'border-primary-500',
                  isSelected &&
                    'bg-primary-100 text-primary-900 text-primary-900 hover:bg-primary-100',
                )}
              >
                {tabOption.label}
              </Tabs.Trigger>
            );
          })}
        </Tabs.List>
      </Container>
      <Container>
        <Tabs.TabsContent value={'detail'} key={'detail'}>
          <ProductDetails />
        </Tabs.TabsContent>
        <Tabs.TabsContent value={'review'} key={'review'}>
          {ReviewsComp}
        </Tabs.TabsContent>
        <Tabs.TabsContent value={'faq'} key={'faq'}>
          <ProductFAQs />
        </Tabs.TabsContent>
      </Container>
    </Tabs.Root>
  );
};

export default ProductDetailsReviewFaqTab;
