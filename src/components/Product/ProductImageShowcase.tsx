'use client';

import { ProductImagesSelect } from '@/lib/db/schema/productImages';
import Image from 'next/image';
import { useRef, useState } from 'react';
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from '../UI/Carousel';

const ProductImageShowcase = ({
  images,
}: {
  images: {
    alt: string;
    url: string;
    isDefault: ProductImagesSelect['isDefault'];
  }[];
}) => {
  const defaultImageIndex = images.findIndex((img) => img.isDefault) || 0;

  const [mainCarouselApi, setMainCarouselApi] = useState<CarouselApi>();
  return (
    <div className="flex max-h-[34rem] gap-4">
      <div className="grid h-full w-[152px] grid-cols-1 grid-rows-3 gap-4">
        {images.map((img, i) => {
          return (
            <div
              key={i}
              className="relative overflow-hidden rounded-main bg-primary-50"
            >
              <Image
                src={img.url}
                alt={img.alt}
                // width={444}
                // height={666}
                className="object-cover grayscale"
                fill
              />
            </div>
          );
        })}
      </div>
      <div className="flex aspect-square flex-grow overflow-hidden rounded-main">
        {images.map((img, i) => {
          return (
            <div
              key={i}
              className="relative basis-full overflow-hidden rounded-main bg-red-50"
            >
              <Image
                src={img.url}
                alt={img.alt}
                // width={444}
                // height={666}
                className="object-cover grayscale"
                fill
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default ProductImageShowcase;
