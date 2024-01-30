'use client';

import { ProductImagesSelect } from '@/lib/db/schema/productImages';
import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';
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

  console.log('IMAGE RE-RENDERED');

  return (
    <div>
      <div className="grid h-full grid-cols-[9rem_1fr] gap-4">
        <Carousel
          setApi={setThumbnailCarouselApi}
          className="h-full overflow-hidden"
          orientation="vertical"
          opts={{ skipSnaps: true, dragFree: true }}
        >
          <CarouselViewport className="h-full">
            <CarouselContent className="-mt-4 h-[calc(100%+1rem)]">
              {images.map((img, i) => {
                return (
                  <CarouselItem
                    onClick={() => {
                      handleThumbClick(i);
                    }}
                    key={i}
                    className={cn('h-full basis-1/3 pt-4')}
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
                          'absolute h-full w-full rounded-2xl bg-white bg-opacity-20 ring-0 ring-inset ring-transparent transition-all duration-200',
                          activeIndex === i &&
                            'bg-opacity-0 ring-2 ring-primary-100 ring-offset-1 ring-offset-primary-200',
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
                        // width={444}
                        // height={666}
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
