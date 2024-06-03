'use client';

import { cn } from '@/lib/util';
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselViewport,
} from '../UI/Carousel';
import { useCallback, useEffect, useState } from 'react';
import { ProductImagesSelect } from '@/lib/db/schema/productImages';
import Image from 'next/image';

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
  const [activeIndex, setActiveIndex] = useState(defaultImageIndex);

  const [mainCarouselApi, setMainCarouselApi] = useState<CarouselApi>();
  const [thumbnailCarouselApi, setThumbnailCarouselApi] =
    useState<CarouselApi>();

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
    <div className="">
      <div className="grid h-full grid-cols-1 grid-rows-[1fr_auto] gap-[var(--gap)] text-2xl font-semibold [--gap:0.625rem] [--thumbnail-size:7rem] md:[--thumbnail-size:8rem] xl:h-max xl:grid-cols-[var(--thumbnail-size)_1fr] xl:grid-rows-1 xl:[--gap:1rem] xl:[--thumbnail-size:9rem]">
        <Carousel
          setApi={setThumbnailCarouselApi}
          className="row-start-2 row-end-2 h-full overflow-clip xl:row-start-auto xl:row-end-auto"
          orientation={'horizontal'}
          opts={{
            skipSnaps: true,
            dragFree: true,
            breakpoints: {
              '(min-width:1280px)': {
                axis: 'y',
              },
            },
          }}
        >
          <CarouselViewport className="h-full">
            <CarouselContent className="-ml-[var(--gap)] h-full flex-row xl:-mt-[var(--gap)] xl:ml-0 xl:h-[calc(100%+var(--gap))] xl:flex-col">
              {images.map((img, i) => {
                return (
                  <CarouselItem
                    key={i}
                    className={cn(
                      'h-[var(--thumbnail-size)] pl-[var(--gap)] xl:pl-0 xl:pt-[var(--gap)]',
                      'basis-[max(var(--thumbnail-size)+var(--gap),33.333%)]',
                    )}
                    onClick={() => {
                      handleThumbClick(i);
                    }}
                  >
                    <div
                      className={cn(
                        'relative h-full w-full overflow-clip rounded-2xl transition-opacity duration-200',
                        i !== activeIndex && 'opacity-50',
                      )}
                    >
                      <Image
                        src={img.url}
                        alt={img.alt}
                        className="object-cover grayscale"
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 768px) 40vw, (max-width: 1024px) 30vw, (max-width: 1280px) 20vw, 15vw"
                        loading="eager"
                        priority
                      />
                    </div>
                  </CarouselItem>
                );
              })}
            </CarouselContent>
          </CarouselViewport>
        </Carousel>
        <div className="">
          <Carousel
            setApi={setMainCarouselApi}
            className="h-full overflow-clip"
          >
            <CarouselViewport className="h-full">
              <CarouselContent className="-ml-[var(--gap)] h-full">
                {images.map((img, i) => {
                  return (
                    <CarouselItem
                      key={i}
                      className={cn(
                        'pl-[var(--gap)]',
                        'h-full xl:aspect-square xl:h-auto',
                      )}
                    >
                      <div
                        className={cn(
                          'relative h-full min-h-[20rem] w-full overflow-clip rounded-main',
                          'sm:aspect-auto md:aspect-auto',
                        )}
                      >
                        <Image
                          src={img.url}
                          alt={img.alt}
                          className="object-cover grayscale"
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 768px) 80vw, (max-width: 1024px) 50vw, (max-width: 1280px) 40vw, 33vw"
                          loading="eager"
                          priority
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
    </div>
  );
};

export default ProductImageShowcase;
