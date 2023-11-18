'use client';

import { FilteredProductItem } from '@/lib/actions/shop';
import { makeValidURL } from '@/lib/util';
import Image from 'next/image';
import Link from 'next/link';
import Star from '../UI/Star';
import { Variants, motion } from 'framer-motion';

const variants: Variants = {
  initial: { opacity: 0, y: 10 },

  animate: (custom: number) => ({
    opacity: 1,

    y: 0,
    transition: { duration: 0.2, delay: custom * 0.1 },
  }),
  // exit: {opacity: 0, }
};

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
        <div className="mb-4 aspect-square w-full overflow-hidden rounded-main">
          <Image
            src={'/products/black-striped-tshirt.png'}
            alt="product"
            width={300}
            height={300}
            className="h-full w-full object-cover"
          />
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
