'use client';
import { Button } from '@/components/UI/Button';
import {
  Carousel,
  CarouselButtons,
  CarouselContent,
  CarouselItem,
  CarouselViewport,
} from '@/components/UI/Carousel';
import { SectionHeading } from '@/components/UI/Homepage';
import * as ProductListingItem from '@/components/UI/ProductListingItem';
import { cn, makeValidURL, priceFormat } from '@/lib/util';
import { type Variants, motion } from 'framer-motion';
import Link from 'next/link';

const MotionLink = motion.create(Link);
const MotionProductListingItem = motion.create(
  ProductListingItem.ProductListingItem,
);
const MotionProductName = motion.create(ProductListingItem.ProductName);
const MotionProductRating = motion.create(ProductListingItem.ProductRating);
const MotionProductPrice = motion.create(ProductListingItem.ProductPrice);
const MotionProductImage = motion.create(ProductListingItem.ProductImage);

const staggerParentVariants: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.3,
    },
  },
};

const revealVariants: Variants = {
  initial: { y: '100%', opacity: '0%' },
  animate: {
    y: '0%',
    opacity: '100%',
    transition: {
      type: 'tween',
      ease: 'backInOut',
      duration: 0.7,
    },
  },
};

const motionLinkStaggerParentVariants: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const productImageVariants: Variants = {
  initial: { y: '10%', opacity: 0 },
  animate: {
    y: '0%',
    opacity: 1,
    transition: {
      type: 'tween',
      ease: 'backInOut',
      duration: 0.6,
    },
  },
};

const productItemVariants: Variants = {
  initial: { y: '100%', opacity: '0%' },
  animate: {
    y: '0%',
    opacity: '100%',
    transition: {
      type: 'tween',
      ease: 'backInOut',
      duration: 0.4,
    },
  },
};

const buttonVariants: Variants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      duration: 0.4,
    },
  },
};

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
    <motion.div
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, amount: 'some' }}
      variants={staggerParentVariants}
    >
      <SectionHeading className="overflow-hidden">
        <motion.span className="inline-flex" variants={revealVariants}>
          {title}
        </motion.span>
      </SectionHeading>
      <Carousel
        opts={{
          align: 'center',
          dragFree: true,
          breakpoints: {
            '(min-width: 1100px)': {
              active: products.length > 4 ? true : false,
            },
          },
        }}
        className="mb-20"
      >
        <CarouselViewport className="@container">
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
                  className="basis-[max(25%,16rem)] overflow-hidden md:pl-5"
                >
                  <MotionLink
                    href={href}
                    variants={motionLinkStaggerParentVariants}
                    className="inline-block h-full w-full"
                  >
                    <MotionProductListingItem>
                      <div className="overflow-hidden">
                        <MotionProductImage
                          alt={alt}
                          src={product.image}
                          variants={productImageVariants}
                          className="origin-bottom-left"
                        />
                      </div>
                      <MotionProductName
                        className="overflow-hidden"
                        variants={productItemVariants}
                      >
                        {product.productName}
                      </MotionProductName>
                      <MotionProductRating
                        variants={productItemVariants}
                        rating={ratingFloat}
                      />
                      <MotionProductPrice
                        className="overflow-hidden"
                        variants={productItemVariants}
                      >
                        {priceFormat(Number.parseFloat(product.productPrice))}
                      </MotionProductPrice>
                    </MotionProductListingItem>
                  </MotionLink>
                </CarouselItem>
              );
            })}
          </CarouselContent>
        </CarouselViewport>
        <div
          className={cn(
            'flex justify-center pt-10',
            products.length <= 4 && '[@media(width>=1100px)]:hidden',
          )}
        >
          <CarouselButtons />
        </div>
      </Carousel>
      <div className="flex items-center justify-center">
        <Button variant={'outline'} size={'xl'} asChild>
          <MotionLink variants={buttonVariants} href={href}>
            View All
          </MotionLink>
        </Button>
      </div>
    </motion.div>
  );
};

export default FeaturedItem;
