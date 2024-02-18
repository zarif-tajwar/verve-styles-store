'use client';

import { useShopFilter } from '@/lib/hooks/useShopFilter';

import { ChevronLeftIcon } from '@heroicons/react/20/solid';
import { Button } from '../UI/Button';
import { TotalProducts } from '@/lib/types/ShopFilter';
import { FILTER_PRODUCTS_PER_PAGE } from '@/lib/validation/constants';

const MobilePagination = ({
  totalProducts,
}: {
  totalProducts: TotalProducts;
}) => {
  const totalPages = Math.ceil((totalProducts || 0) / FILTER_PRODUCTS_PER_PAGE);
  const currentPage = useShopFilter((store) => store.queryStates.page) ?? 1;
  const handlePageChange = useShopFilter((store) => store.handlePageChange);

  return (
    <div className="grid grid-cols-[auto_auto_auto] gap-2">
      <Button
        size={'square'}
        variant={'ghost'}
        roundness={'lg'}
        className="gap-2"
        onClick={() => {
          handlePageChange(currentPage - 1, totalPages);
        }}
      >
        <ChevronLeftIcon className="size-5" />
      </Button>
      <div className="-mt-1 inline-flex min-w-24 items-center justify-center px-4 leading-none">
        {`Page ${currentPage}`}
      </div>
      <Button
        size={'square'}
        variant={'ghost'}
        roundness={'lg'}
        className="gap-2"
        onClick={() => {
          handlePageChange(currentPage + 1, totalPages);
        }}
      >
        <ChevronLeftIcon className="size-5 rotate-180" />
      </Button>
    </div>
  );
};
export default MobilePagination;
