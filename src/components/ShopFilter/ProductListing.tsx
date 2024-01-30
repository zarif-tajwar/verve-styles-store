'use client';

import { FilteredProductItem } from '@/lib/server/shop';
import { makeValidURL } from '@/lib/util';
import Image from 'next/image';
import Link from 'next/link';
import Star from '../UI/Star';

const ProductListing = ({
  product,
  i,
}: {
  product: FilteredProductItem;
  i: number;
}) => {
  const ratingStr = product.averageRating || '0.0';
  const ratingFloat = Number.parseFloat(ratingStr);
  const href = `/${makeValidURL(product.categoryName!)}/${makeValidURL(
    product.name,
  )}-${product.id}`;

  return (
    <Link href={href} className="inline-block">
      <div key={href} className="relative z-0 origin-top-left">
        <div className="relative mb-4 aspect-square w-full overflow-hidden rounded-main">
          {product.imageUrl && (
            <Image
              src={product.imageUrl}
              alt={`${product.name}`}
              className="object-cover grayscale"
              fill
            />
          )}
        </div>
        <div>
          <h3 className="mb-2 text-xl font-medium capitalize">
            {product.name}
          </h3>
        </div>
        <div className="mb-2 flex gap-3">
          <Star rating={ratingFloat} size="sm" />
          <p className="flex text-sm font-medium text-primary-300">
            <span className="block w-[3ch] text-primary-500">{ratingStr}/</span>
            <span className="block">5.0</span>
          </p>
        </div>
        <p className="inline-block text-2xl font-semibold">
          {new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
          }).format(Number.parseFloat(product.price))}
        </p>
      </div>
    </Link>
  );
};

export default ProductListing;
