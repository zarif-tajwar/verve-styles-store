'use client';

import { cn, isValueInArray } from '@/lib/util';
import * as Tabs from '@radix-ui/react-tabs';
import { parseAsStringEnum, useQueryState } from 'nuqs';
import React, { useCallback, useEffect } from 'react';
import WIP from '../UI/WIP';
import { Button } from '../UI/Button';
import { Container } from '../UI/Container';
import { motion } from 'framer-motion';

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

  const selectedIndex = TabOptions.findIndex((o) =>
    tabValue ? o.value === tabValue : o.value === defaultValue,
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
        <div className="mb-8 rounded-[1.75rem] border border-primary-50 p-1 sm:rounded-[2rem] sm:p-2 md:rounded-[2.26rem] lg:rounded-full">
          <Tabs.List className="relative grid w-full gap-[var(--gap)] [--gap:0.25rem] [--movement:calc(100%+var(--gap))] sm:gap-[var(--gap)] sm:[--gap:0.5rem] lg:grid-cols-3">
            {TabOptions.map((tabOption) => {
              const isSelected = tabValue
                ? tabValue === tabOption.value
                : defaultValue === tabOption.value;

              return (
                <Tabs.Trigger
                  key={tabOption.value}
                  value={tabOption.value}
                  className={cn(
                    'center inline-flex items-center justify-center rounded-full px-4 py-3 text-left text-base font-medium text-primary-400 transition-all duration-200 hover:font-semibold hover:text-primary-900 md:py-4 lg:py-5 lg:text-lg',
                    isSelected && 'font-semibold text-primary-900',
                  )}
                >
                  {tabOption.label}
                </Tabs.Trigger>
              );
            })}

            <motion.span
              initial={{
                x: `calc(${selectedIndex} * var(--translate-x))`,
                y: `calc(${selectedIndex} * var(--translate-y))`,
              }}
              animate={{
                x: `calc(${selectedIndex} * var(--translate-x))`,
                y: `calc(${selectedIndex} * var(--translate-y))`,
              }}
              className="absolute inset-0 -z-10 inline-block h-[var(--length)] w-full rounded-full bg-primary-50 [--length:calc((100%-var(--gap)*2)/3)] [--translate-x:0px] [--translate-y:var(--movement)] lg:h-full lg:w-[var(--length)] lg:[--translate-x:var(--movement)] lg:[--translate-y:0px]"
            ></motion.span>
          </Tabs.List>
        </div>
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
