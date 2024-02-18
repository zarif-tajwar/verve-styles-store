'use client';

import { usePagination } from '@/lib/hooks/mantine/usePagination';
import { useShopFilter } from '@/lib/hooks/useShopFilter';
import { TotalProducts } from '@/lib/types/ShopFilter';
import { cn } from '@/lib/util';
import { FILTER_PRODUCTS_PER_PAGE } from '@/lib/validation/constants';
import { Button } from '../UI/Button';
import {
  ChevronLeftIcon,
  EllipsisHorizontalIcon,
} from '@heroicons/react/20/solid';

const ShopFilterPagination = ({
  totalProducts,
}: {
  totalProducts: TotalProducts;
}) => {
  const totalPages = Math.ceil((totalProducts || 0) / FILTER_PRODUCTS_PER_PAGE);
  const currentPage = useShopFilter((store) => store.queryStates.page) ?? 1;
  const handlePageChange = useShopFilter((store) => store.handlePageChange);

  const { active, range } = usePagination({
    total: totalPages,
    initialPage: 1,
    page: currentPage,
    boundaries: 1,
    siblings: 1,
  });

  const isPreviousPageAvailable = active !== 1;
  const isNextPageAvailable = active < totalPages;

  return (
    <div className="">
      <div className="rounded-xl border-primary-50 bg-primary-0 text-sm font-medium lg:border lg:p-2">
        <div className="flex gap-2">
          <Button
            onClick={() => {
              handlePageChange(active - 1, totalPages);
            }}
            size={'square'}
            variant={'ghost'}
            roundness={'lg'}
            disabled={!isPreviousPageAvailable}
          >
            <ChevronLeftIcon className="size-5" />
          </Button>
          <div className="hidden gap-2 lg:flex">
            {range.map((value) => {
              return typeof value !== 'number' ? (
                <span
                  key={Math.random()}
                  className="-mx-2 inline-flex h-10 w-10 items-center justify-center gap-0.5 rounded-lg text-primary-300"
                >
                  <EllipsisHorizontalIcon className="size-5" />
                </span>
              ) : (
                <Button
                  key={value}
                  size={'square'}
                  variant={'ghost'}
                  roundness={'lg'}
                  className={cn(
                    'tracking-wider transition-none',
                    active === value &&
                      'cursor-default bg-primary-500 text-primary-0 hover:bg-primary-500',
                    active !== value && 'hover:bg-primary-50',
                  )}
                  style={{
                    width: `max(2.5rem, ${value.toString().length + 2}ch)`,
                  }}
                  onClick={() => {
                    handlePageChange(value, totalPages);
                  }}
                >
                  {value}
                </Button>
              );
            })}
          </div>
          <div className=" inline-flex min-w-24 items-center justify-center px-4 text-base font-normal leading-none lg:hidden">
            {`Page ${currentPage}`}
          </div>
          <Button
            onClick={() => {
              handlePageChange(active + 1, totalPages);
            }}
            size={'square'}
            variant={'ghost'}
            roundness={'lg'}
            disabled={!isNextPageAvailable}
          >
            <ChevronLeftIcon className="size-5 rotate-180" />
          </Button>
        </div>
      </div>
    </div>
  );
};
export default ShopFilterPagination;
