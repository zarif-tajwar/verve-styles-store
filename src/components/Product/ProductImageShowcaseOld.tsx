'use client';

import { ProductImagesSelect } from '@/lib/db/schema/productImages';
import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselViewport,
} from '../UI/Carousel';
import { cn } from '@/lib/util';

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
  const [thumbnailCarouselApi, setThumbnailCarouselApi] =
    useState<CarouselApi>();

  const [activeIndex, setActiveIndex] = useState(defaultImageIndex);

  const handleThumbClick = useCallback(
    (index: number) => {
      if (!mainCarouselApi || !thumbnailCarouselApi) return;
      mainCarouselApi.scrollTo(index);
    },
    [mainCarouselApi, thumbnailCarouselApi],
  );

  const handleSelect = useCallback(() => {
    if (!mainCarouselApi || !thumbnailCarouselApi) return;
    const snapIndex = mainCarouselApi.selectedScrollSnap();
    setActiveIndex(snapIndex);
    thumbnailCarouselApi.scrollTo(snapIndex);
  }, [mainCarouselApi, thumbnailCarouselApi]);

  useEffect(() => {
    if (!mainCarouselApi) return;
    handleSelect();
    mainCarouselApi.on('select', handleSelect);
    mainCarouselApi.on('reInit', handleSelect);
  }, [handleSelect, mainCarouselApi]);

  return (
    <div>
      <div className="grid h-full grid-rows-[1fr_9rem] gap-[var(--gap)] [--gap:1rem] lg:grid-cols-[9rem_1fr] lg:grid-rows-none">
        <Carousel
          setApi={setThumbnailCarouselApi}
          className="row-start-2 row-end-2 h-full overflow-hidden lg:row-start-1 lg:row-end-1"
          orientation="vertical"
          opts={{
            skipSnaps: true,
            dragFree: true,
            breakpoints: {
              '(max-width:1024px)': {
                axis: 'x',
              },
            },
          }}
        >
          <CarouselViewport className="h-full">
            <CarouselContent className="-ml-[var(--gap)] h-full flex-row lg:-mt-[var(--gap)] lg:ml-0 lg:h-[calc(100%+var(--gap))] lg:flex-col">
              {[...images, ...images].map((img, i) => {
                return (
                  <CarouselItem
                    onClick={() => {
                      handleThumbClick(i);
                    }}
                    key={i}
                    className={cn(
                      'h-full basis-[max(33.33%,9rem)] pl-[var(--gap)] lg:basis-[max(33.33%,9rem)] lg:pl-0 lg:pt-[var(--gap)]',
                    )}
                  >
                    <div
                      className={cn(
                        'relative h-full w-full overflow-hidden rounded-2xl',
                        // 'opacity-30 transition-opacity duration-200',
                        // activeIndex === i && 'opacity-100',
                      )}
                    >
                      <Image
                        src={img.url}
                        alt={img.alt}
                        className="object-cover grayscale"
                        fill
                      />

                      <span
                        className={cn(
                          'absolute h-full w-full rounded-2xl ring-0 ring-inset ring-transparent transition-all duration-200',
                          activeIndex === i && 'ring-4 ring-primary-400',
                        )}
                      ></span>
                    </div>
                  </CarouselItem>
                );
              })}
            </CarouselContent>
          </CarouselViewport>
        </Carousel>
        <Carousel
          opts={{
            startIndex: defaultImageIndex,
          }}
          className="h-full overflow-hidden"
          setApi={setMainCarouselApi}
        >
          <CarouselViewport className="h-full">
            <CarouselContent className="-ml-4 h-full">
              {images.map((img, i) => {
                return (
                  <CarouselItem key={i} className="h-full pl-4">
                    <div className="relative h-full w-full overflow-hidden rounded-main">
                      <Image
                        src={img.url}
                        alt={img.alt}
                        className="object-cover grayscale"
                        fill
                      />
                    </div>
                  </CarouselItem>
                );
              })}
            </CarouselContent>
          </CarouselViewport>
        </Carousel>
      </div>
    </div>
  );

  // return (
  //   <div className="grid max-h-[34rem] grid-cols-[10rem_1fr] gap-4">
  //     <div className="grid h-full grid-cols-1 grid-rows-3 gap-4">
  //       {images.map((img, i) => {
  //         return (
  //           <div
  //             key={i}
  //             className="relative overflow-hidden rounded-main bg-primary-50"
  //           >
  //             <Image
  //               src={img.url}
  //               alt={img.alt}
  //               // width={444}
  //               // height={666}
  //               className="object-cover grayscale"
  //               fill
  //             />
  //           </div>
  //         );
  //       })}
  //     </div>
  //     <div className="aspect-square flex-grow rounded-main">
  //       <Carousel className="h-full w-full overflow-hidden">
  //         <CarouselContent className="h-full">
  //           {images.map((img, i) => {
  //             return (
  //               <CarouselItem key={i} className="h-full">
  //                 <div className="relative h-full w-full overflow-hidden rounded-main bg-red-50">
  //                   {/* <Image
  //                     src={img.url}
  //                     alt={img.alt}
  //                     className=" object-cover grayscale"
  //                     fill
  //                   /> */}
  //                   <div className="min-h-full min-w-full"></div>
  //                 </div>
  //               </CarouselItem>
  //             );
  //           })}
  //         </CarouselContent>
  //       </Carousel>
  //     </div>
  //   </div>
  // );
};
export default ProductImageShowcase;
