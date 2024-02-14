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

const ProductImageShowcase2 = () => {
  const numbers = [...Array(5).keys()].map((_, i) => i + 1);

  const [mainCarouselApi, setMainCarouselApi] = useState<CarouselApi>();
  const [thumbnailCarouselApi, setThumbnailCarouselApi] =
    useState<CarouselApi>();

  const [activeIndex, setActiveIndex] = useState(0);

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
      <div className="grid h-full grid-cols-1 grid-rows-[1fr_auto] gap-[var(--gap)] bg-red-100 text-2xl font-semibold [--gap:0.625rem] [--thumbnail-size:7rem] sm:[--gap:0.75rem] md:[--gap:1rem] md:[--thumbnail-size:8rem] xl:h-max xl:grid-cols-[var(--thumbnail-size)_1fr] xl:grid-rows-1 xl:[--thumbnail-size:9rem]">
        <Carousel
          setApi={setThumbnailCarouselApi}
          className="row-start-2 row-end-2 h-full overflow-clip bg-green-100 xl:row-start-auto xl:row-end-auto"
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
              {numbers.map((num, i) => {
                return (
                  <CarouselItem
                    key={num}
                    className={cn(
                      'h-[var(--thumbnail-size)] basis-[max(var(--thumbnail-size)+var(--gap),1%)]  pl-[var(--gap)] xl:pl-0 xl:pt-[var(--gap)]',
                      'basis-[clamp(var(--thumbnail-size)+var(--gap),33.333%,var(--thumbnail-size)+var(--gap)+1rem)]',
                    )}
                    onClick={() => {
                      handleThumbClick(i);
                    }}
                  >
                    <div
                      className={cn(
                        'flex h-full w-full items-center justify-center bg-green-200',
                        i === activeIndex && 'bg-green-300',
                      )}
                    >
                      <span>{num}</span>
                    </div>
                  </CarouselItem>
                );
              })}
            </CarouselContent>
          </CarouselViewport>
        </Carousel>
        <div className="max-w-[25.25rem] md:max-w-none">
          <Carousel
            setApi={setMainCarouselApi}
            className="h-full overflow-clip bg-blue-100 text-4xl"
          >
            <CarouselViewport className="h-full">
              <CarouselContent className="-ml-[var(--gap)] h-full">
                {numbers.map((num) => {
                  return (
                    <CarouselItem
                      key={num}
                      className={cn(
                        'pl-[var(--gap)]',
                        'h-full xl:aspect-square xl:h-auto',
                        // 'aspect-square h-full',
                      )}
                    >
                      <div
                        className={cn(
                          'flex h-full min-h-[20rem] w-full items-center justify-center bg-blue-200',
                          'sm:aspect-auto md:aspect-auto',
                          //   'aspect-square',
                        )}
                      >
                        <span>{num}</span>
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

export default ProductImageShowcase2;
