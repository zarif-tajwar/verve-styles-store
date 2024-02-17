'use client';

import * as ProductListingItem from '@/components/UI/ProductListingItem';
import { FilteredProductItem } from '@/lib/server/shop';
import { cn, makeValidURL, priceFormat } from '@/lib/util';
import Image from 'next/image';
import Link from 'next/link';
import Star from '../UI/Star';

export const ProductListing = ({
  products,
}: {
  products: FilteredProductItem[];
}) => {
  return (
    <div
      key={'products'}
      className={cn(
        'relative grid gap-x-4 gap-y-9 @container sm:gap-x-5',
        'grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3',
        '[@media(width<23.75rem)]:grid-cols-1',
        'auto-rows-auto',
      )}
    >
      {products.map((product) => {
        const uniqueKey = product.name + product.price + product.categoryName;
        const ratingStr = product.averageRating || '0.0';
        const ratingFloat = Number.parseFloat(ratingStr);
        const href = `/${makeValidURL(product.categoryName!)}/${makeValidURL(
          product.name,
        )}-${product.id}`;
        return (
          <Link
            href={href}
            key={uniqueKey}
            className="row-span-4 grid grid-rows-subgrid gap-x-0 gap-y-0"
          >
            <div className="relative mb-3 aspect-square w-full overflow-hidden rounded-main sm:mb-4">
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
              <h3 className="mb-1 text-lg font-semibold capitalize leading-tight sm:text-xl lg:text-2xl">
                {product.name}
              </h3>
            </div>
            <div className="mb-4 flex items-center gap-2 sm:gap-3">
              <Star rating={ratingFloat} size="sm" />
              <p className="flex text-sm font-medium text-primary-300 md:text-base">
                <span className="block w-[3ch] text-primary-500">
                  {ratingStr}/
                </span>
                <span className="block">5.0</span>
              </p>
            </div>
            <p className="inline-block text-xl font-bold leading-none sm:text-2xl lg:font-bold">
              {new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
              }).format(Number.parseFloat(product.price))}
            </p>
          </Link>
        );
      })}
    </div>
  );
};
