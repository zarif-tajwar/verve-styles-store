'use client';

import { useShopFilterStore } from '@/lib/store/shop-filter';
import Link from 'next/link';

const ShopLink = () => {
  const resetFilterState = useShopFilterStore((store) => store.reset);

  return (
    <li className="inline-block" onClick={() => resetFilterState()}>
      <Link
        className="px-3 py-2 text-black/70 transition-colors hover:text-black"
        href={'/shop'}
      >
        Shop
      </Link>
    </li>
  );
};
export default ShopLink;
