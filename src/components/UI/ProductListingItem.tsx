import { cn, makeValidURL } from '@/lib/util';
import React from 'react';
import { Slot } from '@radix-ui/react-slot';
import Link from 'next/link';
import Image from 'next/image';
import Star from './Star';

export interface ProductListingItemProps
  extends React.HTMLAttributes<HTMLDivElement> {
  product: {
    productId: number;
    productName: string;
    productPrice: string;
    rating: string | null;
    category: string;
    image: string;
  };
}

export const ProductListingItem = React.forwardRef<
  HTMLDivElement,
  ProductListingItemProps
>(({ className, product, ...props }, ref) => {
  const ratingStr = product.rating || '0.0';
  const ratingFloat = Number.parseFloat(ratingStr);
  const href = `/${makeValidURL(product.category)}/${makeValidURL(
    product.productName,
  )}-${product.productId}`;
  return (
    <div key={product.productId} className={className} ref={ref} {...props}>
      <Link href={href} className="aspect-square w-full rounded-2xl">
        <div key={href} className="relative z-0 origin-top-left">
          <div className="relative mb-4 aspect-square w-full overflow-hidden rounded-main">
            {product.image && (
              <Image
                src={product.image}
                alt={`Verve's ${product.productName} named clothing item in ${product.category} category.`}
                className="object-cover grayscale"
                fill
              />
            )}
          </div>
          <div>
            <h3 className="mb-2 text-xl font-medium capitalize">
              {product.productName}
            </h3>
          </div>
          <div className="mb-2 flex gap-3">
            <Star rating={ratingFloat} size="sm" />
            <p className="flex text-sm font-medium text-primary-300">
              <span className="block w-[3ch] text-primary-500">
                {ratingStr}/
              </span>
              <span className="block">5.0</span>
            </p>
          </div>
          <p className="inline-block text-2xl font-semibold">
            {new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
            }).format(Number.parseFloat(product.productPrice))}
          </p>
        </div>
      </Link>
    </div>
  );
});

ProductListingItem.displayName = 'ProductListingItem';
