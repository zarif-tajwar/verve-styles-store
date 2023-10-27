'use client';

import { cn } from '@/lib/util';
import * as Tabs from '@radix-ui/react-tabs';
import ProductReviews from './ProductReviews';
import { Review } from '@/lib/types/product-page';
import WIP from '../UI/WIP';
import useQueryParams from '@/lib/hooks/useQueryParams';

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

const ProductDetailsReviewFaqTab = ({
  reviews,
  searchParams,
}: {
  reviews: Review[];
  searchParams: SearchParamsServer;
}) => {
  const { queryParams, setQueryParams } = useQueryParams<{ tab: string }>();

  // const valueFromQueryParams =
  //   queryParams.get('tab') || TabOptions.at(0)?.value;
  const valueFromQueryParams = searchParams.tab;

  const tabValue =
    Array.isArray(valueFromQueryParams) || valueFromQueryParams === undefined
      ? TabOptions.at(0)?.value
      : valueFromQueryParams;

  return (
    <Tabs.Root
      defaultValue={tabValue}
      onValueChange={(v) =>
        setQueryParams({
          tab: v === TabOptions.at(0)?.value ? undefined : v,
        })
      }
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
        <ProductReviews reviews={reviews} />
      </Tabs.TabsContent>
      <Tabs.TabsContent value={'faq'} key={'faq'}>
        <ProductFAQs />
      </Tabs.TabsContent>
    </Tabs.Root>
  );
};

export default ProductDetailsReviewFaqTab;
