'use client';

import { usePagination } from '@/lib/hooks/mantine/usePagination';
import useQueryParams from '@/lib/hooks/useQueryParams';
import { useShopFilterStore } from '@/lib/store/shop-filter';
import { cn } from '@/lib/util';
import { FILTER_PRODUCTS_PER_PAGE } from '@/lib/validation/constants';
import { zParsePageNumber } from '@/lib/validation/schemas';
import { useEffect } from 'react';

const ShopFilterPagination = ({
  totalProducts,
}: {
  totalProducts?: number;
}) => {
  // const totalPages = Math.ceil((1000 ?? 0) / FILTER_PRODUCTS_PER_PAGE);
  const totalPages = Math.ceil((totalProducts ?? 0) / FILTER_PRODUCTS_PER_PAGE);

  const [page, updateFilterState] = useShopFilterStore((store) => [
    store.page,
    store.update,
  ]);

  const { queryParams, setQueryParams } = useQueryParams<{ page: string }>();

  const { active, range } = usePagination({
    total: totalPages,
    initialPage: 1,
    page: page,
  });

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
      updateFilterState({ page: data });
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // if (totalPages < 2) return null;

  const setPage = (pageNum: number) => {
    if (pageNum < 1 || pageNum === page || pageNum > totalPages) return;
    updateFilterState({ page: pageNum });
    setQueryParams({ page: pageNum === 1 ? undefined : pageNum.toString() });
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  };

  return (
    <div className="">
      <div className="flex w-full items-center justify-center">
        <nav className="overflow-hidden rounded-xl bg-offwhite px-3.5 py-2.5 text-sm font-medium">
          <div className="flex gap-2">
            <button
              onClick={() => {
                setPage(page - 1);
              }}
              className={cn(
                'flex h-10 w-10 items-center justify-center rounded-lg',
                'hover:bg-black/5',
                page === 1 && 'cursor-default opacity-20 hover:bg-transparent',
                // 'disabled:opacity-20 disabled:hover:bg-transparent',
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
                    active === value &&
                      'cursor-default bg-black text-white duration-0',
                    active !== value && 'hover:bg-black/5',
                  )}
                  onClick={() => {
                    setPage(value);
                  }}
                  // disabled={active === value}
                >
                  {value}
                </button>
              );
            })}
            <button
              onClick={() => {
                setPage(page + 1);
              }}
              className={cn(
                'flex h-10 w-10 items-center justify-center rounded-lg',
                'hover:bg-black/5',
                page === totalPages &&
                  'cursor-default opacity-20 hover:bg-transparent',
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
    </div>
  );
};
export default ShopFilterPagination;
