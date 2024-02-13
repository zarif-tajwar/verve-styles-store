'use client';

import { useQueryState } from 'nuqs';
import { useCallback } from 'react';

const useCartDrawerOpen = () => {
  const [openQueryState, setOpenQueryState] = useQueryState('cart');

  const isOpen = openQueryState === 'open';

  const handleOpenChange = useCallback(
    (open: boolean) => {
      if (open) setOpenQueryState('open');
      if (!open) setOpenQueryState(null);
    },
    [setOpenQueryState],
  );
  return { isOpen, handleOpenChange };
};
export default useCartDrawerOpen;
