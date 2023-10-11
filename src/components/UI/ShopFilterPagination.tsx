'use client';

import { usePagination } from '@/lib/hooks/mantine/usePagination';
import useQueryParams from '@/lib/hooks/useQueryParams';
import { useShopFilterStore } from '@/lib/store/shop-filter';
import { cn } from '@/lib/util';
import { zParsePageNumber } from '@/lib/validation/schemas';
import { ChevronLeftIcon } from '@radix-ui/react-icons';
import { useCallback, useEffect, useState } from 'react';

const ShopFilterPagination = ({
  totalProducts,
}: {
  totalProducts?: number;
}) => {
  const totalPages = Math.ceil((totalProducts ?? 0) / 9);
  const [page, updateFilterState] = useShopFilterStore((store) => [
    store.page,
    store.update,
  ]);

  const { active, range, setPage } = usePagination({
    total: totalPages,
    initialPage: 1,
  });
  const { queryParams, setQueryParams } = useQueryParams<{ page: string }>();

  const setPageWithUrl = (pageNum: number) => {
    setPage(pageNum);
    updateFilterState({ page: pageNum });
    setQueryParams({ page: pageNum === 1 ? undefined : pageNum.toString() });
  };

  useEffect(() => {
    const pageFromUrl = queryParams.get('page');

    if (pageFromUrl === null) return;

    const parsedPageFromUrl = zParsePageNumber().safeParse(pageFromUrl);

    if (!parsedPageFromUrl.success) return;

    const data = parsedPageFromUrl.data;

    if (data === undefined) return;

    if (data > totalPages) {
      setQueryParams({ page: undefined });
    } else {
      setPage(data);
      updateFilterState({ page: data });
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // useEffect(() => {
  //   setPage(page);
  //   setQueryParams({ page: page === 1 ? undefined : page.toString() });
  // }, [page]);

  return (
    <>
      <div>{active}</div>
      <div>{page}</div>
      <div className="flex w-full items-center justify-center">
        <nav className="overflow-hidden rounded-lg bg-offwhite px-3.5 py-2.5 text-sm font-medium">
          <div className="flex gap-2">
            <button
              onClick={() => {
                // previous();
                setPageWithUrl(active - 1);
              }}
              className={cn(
                'flex h-10 w-10 items-center justify-center rounded-lg',
                'hover:bg-black/5',
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
            </button>
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
                <button
                  key={value}
                  className={cn(
                    'flex h-10 w-10 items-center justify-center rounded-lg tracking-wider',
                    //   'transition-all duration-200',
                    active === value && 'bg-black text-white duration-0',
                    active !== value && 'hover:bg-black/5',
                  )}
                  onClick={() => {
                    setPageWithUrl(value);
                  }}
                >
                  {value}
                </button>
              );
            })}
            <button
              onClick={() => {
                // next();
                setPageWithUrl(active + 1);
              }}
              className={cn(
                'flex h-10 w-10 items-center justify-center rounded-lg',
                'hover:bg-black/5',
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
            </button>
          </div>
        </nav>
      </div>
    </>
  );
};
export default ShopFilterPagination;
