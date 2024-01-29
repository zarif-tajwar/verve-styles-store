'use client';

import { ArrowLeftMicro } from '@/components/Svgs/icons';
import { Button } from '@/components/UI/Button';
import { useOrderFilterStore } from '@/lib/store/user-order';

const OrdersPagination = ({ ordersCount }: { ordersCount: number }) => {
  const page = useOrderFilterStore((store) => store.page);
  const setPage = useOrderFilterStore((store) => store.setPage);
  return (
    <div className="flex justify-center pt-16">
      <div className="grid grid-cols-2 gap-4">
        <Button
          variant={'secondary'}
          roundness={'lg'}
          className="justify-between gap-3"
          disabled={page <= 1}
          onClick={() => setPage(page - 1)}
        >
          <ArrowLeftMicro className="-ml-0.5" />
          Previous
        </Button>
        <Button
          variant={'secondary'}
          roundness={'lg'}
          className="justify-between gap-3"
          onClick={() => setPage(page + 1)}
          disabled={ordersCount < 4}
        >
          Next
          <ArrowLeftMicro className="-mr-0.5 rotate-180" />
        </Button>
      </div>
    </div>
  );
};
export default OrdersPagination;
