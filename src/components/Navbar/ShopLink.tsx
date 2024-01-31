import Link from 'next/link';
import { Button } from '../UI/Button';
import { BuildingStorefrontIcon } from '@heroicons/react/16/solid';

const ShopLink = () => {
  return (
    <li className="inline-block">
      <Button asChild variant={'inverse'} className="gap-2 font-medium">
        <Link
          // className="px-3 py-2 text-black/70 transition-colors hover:text-black"
          href={'/shop'}
        >
          <BuildingStorefrontIcon className="size-4" />
          Go to Shop
        </Link>
      </Button>
    </li>
  );
};
export default ShopLink;
