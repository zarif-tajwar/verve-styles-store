'use client';

import { usePagination } from '@/lib/hooks/mantine/usePagination';
import useQueryParams from '@/lib/hooks/useQueryParams';
import { useShopFilterStore } from '@/lib/store/shop-filter';
import { cn } from '@/lib/util';
import { FILTER_PRODUCTS_PER_PAGE } from '@/lib/validation/constants';
import { zParsePageNumber } from '@/lib/validation/schemas';
import { useEffect } from 'react';
import { Button } from '../UI/Button';
import { useShopFilter } from '@/lib/hooks/useShopFilter';
import { TotalProducts } from '@/lib/types/ShopFilter';

const ShopFilterPagination = ({
  totalProducts,
}: {
  totalProducts: TotalProducts;
}) => {
  const totalPages = Math.ceil((totalProducts || 0) / FILTER_PRODUCTS_PER_PAGE);
  const currentPage = useShopFilter((store) => store.currentPage);
  const handlePageChange = useShopFilter((store) => store.handlePageChange);

  const { active, range } = usePagination({
    total: totalPages,
    initialPage: 1,
    page: currentPage,
  });

  console.log('PAGINATION STATUS RENDERED');

  // if (totalPages < 2) return null;

  return (
    <div className="">
      <div className="flex w-full items-center justify-center">
        <nav className="overflow-hidden rounded-xl bg-primary-50 px-3.5 py-2.5 text-sm font-medium">
          <div className="flex gap-2">
            <Button
              onClick={() => {
                handlePageChange(currentPage - 1, totalPages);
              }}
              size={'square'}
              variant={'ghost'}
              roundness={'lg'}
              className={cn(
                currentPage === 1 &&
                  'cursor-default opacity-20 hover:bg-transparent',
                'hover:bg-primary-100',
              )}
            >
              <svg
                width="7"
                height="13"
                viewBox="0 0 7 13"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="rotate-180"
              >
                <path
                  d="M1 12.1589L5.59317 7.56569C6.13561 7.02325 6.13561 6.13561 5.59317 5.59317L1 1"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeMiterlimit="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Button>
            {range.map((value) => {
              return typeof value !== 'number' ? (
                <div
                  key={Math.random()}
                  className="-mx-2 flex h-10 w-10 items-center justify-center gap-0.5 rounded-lg pt-2 tracking-wider"
                >
                  {[...Array(4).keys()].map((_, i) => (
                    <span
                      key={i}
                      className="h-0.5 w-0.5 rounded-full bg-black"
                    ></span>
                  ))}
                </div>
              ) : (
                <Button
                  key={value}
                  size={'square'}
                  variant={active === value ? 'default' : 'ghost'}
                  roundness={'lg'}
                  className={cn(
                    'tracking-wider transition-none',
                    active === value && 'cursor-default hover:bg-primary-900',
                    active !== value && 'hover:bg-primary-100',
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
            <Button
              onClick={() => {
                handlePageChange(currentPage + 1, totalPages);
              }}
              size={'square'}
              variant={'ghost'}
              roundness={'lg'}
              className={cn(
                currentPage === totalPages &&
                  'cursor-default opacity-20 hover:bg-transparent',
                'hover:bg-primary-100',
              )}
            >
              <svg
                width="7"
                height="13"
                viewBox="0 0 7 13"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1 12.1589L5.59317 7.56569C6.13561 7.02325 6.13561 6.13561 5.59317 5.59317L1 1"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeMiterlimit="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Button>
          </div>
        </nav>
      </div>
    </div>
  );
};
export default ShopFilterPagination;
