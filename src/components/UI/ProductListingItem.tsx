import React from 'react';
import { Slot } from '@radix-ui/react-slot';
import Link, { LinkProps } from 'next/link';
import Image from 'next/image';
import Star from './Star';
import { cn } from '@/lib/util';

export interface ProductListingItemProps
  extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  asChild?: boolean;
}

export const ProductListingItem = React.forwardRef<
  HTMLDivElement,
  ProductListingItemProps
>(({ className, asChild, ...props }, ref) => {
  const Comp = asChild ? Slot : 'div';
  return (
    <Comp
      ref={ref}
      className={cn('rounded-2xl @container/item', className)}
      {...props}
    />
  );
});

ProductListingItem.displayName = 'ProductListingItem';

interface ProductRatingProps extends React.HTMLAttributes<HTMLDivElement> {
  asChild?: boolean;
  rating: number;
}

const ProductRating = React.forwardRef<HTMLDivElement, ProductRatingProps>(
  ({ className, rating, asChild, ...props }, ref) => {
    const Comp = asChild ? Slot : 'div';
    return (
      <Comp
        ref={ref}
        className={cn(
          '-ml-1 mb-4 flex items-center gap-3 @[15rem]/item:mb-5',
          className,
        )}
        {...props}
      >
        <Star rating={rating} size="sm" />
        <p className="flex text-sm font-semibold text-primary-300">
          <span className="block w-[3ch] text-primary-500">
            {rating.toFixed(1)}/
          </span>
          <span className="block">5.0</span>
        </p>
      </Comp>
    );
  },
);

ProductRating.displayName = 'ProductRating';

interface ProductImageProps extends React.HTMLAttributes<HTMLDivElement> {
  asChild?: boolean;
  alt: string;
  src: string;
}

const ProductImage = React.forwardRef<HTMLDivElement, ProductImageProps>(
  ({ className, asChild, alt, src, ...props }, ref) => {
    const Comp = asChild ? Slot : 'div';
    return (
      <Comp
        ref={ref}
        className={cn(
          'relative mb-3 aspect-square w-full overflow-hidden rounded-main @[15rem]/item:mb-4',
          className,
        )}
        {...props}
      >
        <Image
          src={src}
          alt={alt}
          className="object-cover grayscale"
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, (max-width: 1024px) 25vw, 20vw"
        />
      </Comp>
    );
  },
);

ProductImage.displayName = 'ProductImage';

interface ProductNameProps extends React.HTMLAttributes<HTMLHeadingElement> {
  asChild?: boolean;
  children: React.ReactNode;
}

const ProductName = React.forwardRef<HTMLHeadingElement, ProductNameProps>(
  ({ className, asChild, ...props }, ref) => {
    const Comp = asChild ? Slot : 'h3';
    return (
      <Comp
        ref={ref}
        className={cn(
          'mb-0 line-clamp-1 text-lg font-semibold capitalize @[15rem]/item:mb-1 @[15rem]/item:text-xl @[18rem]/item:mb-1.5 @[18rem]/item:text-2xl',
          className,
        )}
        {...props}
      />
    );
  },
);

ProductName.displayName = 'ProductName';

interface ProductPriceProps extends React.HTMLAttributes<HTMLParagraphElement> {
  asChild?: boolean;
  children: React.ReactNode;
}

const ProductPrice = React.forwardRef<HTMLParagraphElement, ProductPriceProps>(
  ({ className, asChild, ...props }, ref) => {
    const Comp = asChild ? Slot : 'p';
    return (
      <Comp
        ref={ref}
        className={cn(
          'inline-block text-xl font-semibold @[15rem]/item:text-2xl @[18rem]/item:text-3xl',
          className,
        )}
        {...props}
      />
    );
  },
);

ProductPrice.displayName = 'ProductPrice';

export { ProductPrice, ProductName, ProductRating, ProductImage };
