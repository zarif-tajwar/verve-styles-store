'use client';
import { cn, makeValidURL, priceFormat } from '@/lib/util';
import Link from 'next/link';
import { Button } from '../UI/Button';
import { SectionHeading } from '../UI/Homepage';
import * as ProductListingItem from '../UI/ProductListingItem';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselViewport,
} from '../UI/Carousel';

const FeaturedItem = ({
  title,
  products,
  href,
}: {
  title: string;
  products: {
    productId: number;
    productName: string;
    productPrice: string;
    rating: string | null;
    category: string;
    image: string;
  }[];
  href: string;
}) => {
  return (
    <div className="py-16">
      <SectionHeading>{title}</SectionHeading>
      <Carousel
        opts={{
          align: 'center',
          dragFree: true,
          breakpoints: {
            '(min-width: 1100px)': {
              active: false,
            },
          },
        }}
        className="mb-16"
      >
        <CarouselViewport className="">
          <CarouselContent className="md:-ml-5">
            {products.map((product, i) => {
              const ratingStr = product.rating || '0.0';
              const ratingFloat = Number.parseFloat(ratingStr);
              const href = `/${makeValidURL(product.category)}/${makeValidURL(
                product.productName,
              )}-${product.productId}`;
              const alt = `Verve's ${product.productName} named clothing item in ${product.category} category.`;

              return (
                <CarouselItem
                  key={i}
                  className="basis-[max(25%,16rem)] md:pl-5"
                >
                  <ProductListingItem.ProductListingItem asChild>
                    <Link href={href}>
                      <ProductListingItem.ProductImage
                        alt={alt}
                        src={product.image}
                      />
                      <ProductListingItem.ProductName>
                        {product.productName}
                      </ProductListingItem.ProductName>
                      <ProductListingItem.ProductRating rating={ratingFloat} />
                      <ProductListingItem.ProductPrice>
                        {priceFormat(Number.parseFloat(product.productPrice))}
                      </ProductListingItem.ProductPrice>
                    </Link>
                  </ProductListingItem.ProductListingItem>
                </CarouselItem>
              );
            })}
          </CarouselContent>
        </CarouselViewport>
      </Carousel>
      <div className="flex items-center justify-center">
        <Button variant={'outline'} size={'xl'} asChild className="">
          <Link href={href}>View All</Link>
        </Button>
      </div>
    </div>
  );
};

export default FeaturedItem;
