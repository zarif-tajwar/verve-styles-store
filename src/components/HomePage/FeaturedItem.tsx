'use client';
import { motion, Variants } from 'framer-motion';
import { Button } from '../UI/Button';
import { makeValidURL } from '@/lib/util';
import Link from 'next/link';
import Image from 'next/image';
import Star from '../UI/Star';

const MotionVariantsParent: Variants = {
  initial: {},
  reveal: { transition: { staggerChildren: 0.15 } },
};

const MotionVariantsItem: Variants = {
  initial: {
    y: 100,
    opacity: 0,
  },
  reveal: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      type: 'spring',
      bounce: 0.5,
      damping: 10,
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
    <div className="py-16">
      <h2 className="mb-14 text-center font-integral-cf text-5xl font-bold uppercase">
        {title}
      </h2>
      <motion.div
        className="mb-12 grid grid-cols-4 gap-5"
        variants={MotionVariantsParent}
        initial={'initial'}
        whileInView={'reveal'}
        viewport={{ once: true, amount: 0.8 }}
      >
        {products.map((product) => {
          const ratingStr = product.rating || '0.0';
          const ratingFloat = Number.parseFloat(ratingStr);
          const href = `/${makeValidURL(product.category)}/${makeValidURL(
            product.productName,
          )}-${product.productId}`;
          return (
            <motion.div
              key={product.productId}
              className="aspect-square rounded-2xl"
              variants={MotionVariantsItem}
            >
              <Link href={href} className="w-full">
                <div key={href} className="relative z-0 origin-top-left">
                  <div className="relative mb-4 aspect-square w-full overflow-hidden rounded-main">
                    {product.image && (
                      <Image
                        src={product.image}
                        alt={`${product.productName}`}
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
            </motion.div>
          );
        })}
      </motion.div>
      <div className="flex items-center justify-center">
        <Button variant={'outline'} size={'xl'} asChild>
          <Link href={href}>View All</Link>
        </Button>
      </div>
    </div>
  );
};

export default FeaturedItem;
