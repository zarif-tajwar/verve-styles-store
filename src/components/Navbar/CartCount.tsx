'use client';

import { useCartItemsQuery } from '@/lib/hooks/cart-hooks';
import Spinner from '../UI/Spinner';

const CartCount = () => {
  const { data, isFetching } = useCartItemsQuery();
  const totalCartItemsCount = data?.length || 0;

  return (
    <span className="absolute -top-1 right-0 z-20 translate-x-full">
      {isFetching && !data ? (
        <Spinner size={14} className="text-primary-400" />
      ) : (
        totalCartItemsCount !== 0 && (
          <span className="aspect-square text-xs font-medium text-primary-900">
            {totalCartItemsCount}
          </span>
        )
      )}
    </span>
  );
};
export default CartCount;
