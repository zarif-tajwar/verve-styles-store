'use client';

import { FaceFrownIcon } from '@heroicons/react/24/outline';
import { RetryIcon } from '../Svgs/icons';
import { Button } from '../UI/Button';
import { useShopFilter } from '@/lib/hooks/useShopFilter';
import { useRouter } from 'next/navigation';

const NoProductsFound = () => {
  const findIsAnyFilterActive = useShopFilter(
    (store) => store.findIsAnyFilterActive,
  );
  const resetAllFilters = useShopFilter((store) => store.resetAllFilters);
  const router = useRouter();

  const isAnyFilterActive = findIsAnyFilterActive();

  return (
    <div className="flex h-[50dvh] items-center justify-center">
      <div className="flex flex-col items-center">
        <FaceFrownIcon className="size-10 text-primary-500" />
        <p className="mt-1 text-xl font-semibold">No products were found!</p>
        <div className="mt-4 flex justify-center gap-2">
          {isAnyFilterActive && (
            <Button onClick={() => resetAllFilters()}>
              <RetryIcon className="size-4" />
              Reset Filters
            </Button>
          )}
          <Button
            onClick={() => {
              router.refresh();
            }}
          >
            <RetryIcon className="size-4" />
            Retry
          </Button>
        </div>
      </div>
    </div>
  );
};
export default NoProductsFound;
