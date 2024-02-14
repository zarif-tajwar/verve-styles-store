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
import { Button } from '../UI/Button';

const ProductImageShowcase2 = () => {
  const numbers = [...Array(5).keys()].map((_, i) => i + 1);

  const [orientation, setOrientation] = useState<'horizontal' | 'vertical'>(
    'vertical',
  );

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
    <div className="relative @container">
      <Button
        className="absolute z-[99999]"
        onClick={() => setOrientation('horizontal')}
      >
        Make it horizontal
      </Button>
      <div className="grid h-full grid-cols-1 grid-rows-[1fr_auto] gap-[var(--gap)] bg-red-100 text-2xl font-semibold [--gap:1rem] [--thumbnail-size:9rem] @lg:h-max @lg:grid-cols-[var(--thumbnail-size)_1fr] @lg:grid-rows-1">
        <Carousel
          setApi={setThumbnailCarouselApi}
          className="row-start-2 row-end-2 h-full overflow-clip bg-green-100 @lg:row-start-auto @lg:row-end-auto"
          orientation={orientation}
          opts={{
            skipSnaps: true,
            dragFree: true,
          }}
        >
          <CarouselViewport className="h-full">
            <CarouselContent className="-ml-[var(--gap)] h-full flex-row @lg:-mt-[var(--gap)] @lg:ml-0 @lg:h-[calc(100%+var(--gap))] @lg:flex-col">
              {numbers.map((num, i) => {
                return (
                  <CarouselItem
                    key={num}
                    className={cn(
                      'h-[var(--thumbnail-size)] basis-[max(var(--thumbnail-size)+var(--gap),1%)]  pl-[var(--gap)] @lg:pl-0 @lg:pt-[var(--gap)]',
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
        <div className="">
          <Carousel
            setApi={setMainCarouselApi}
            className="h-full overflow-clip bg-blue-100 text-4xl"
          >
            <CarouselViewport className="h-full">
              <CarouselContent className="h-full">
                {numbers.map((num) => {
                  return (
                    <CarouselItem
                      key={num}
                      className="h-full @lg:aspect-square @lg:h-auto"
                    >
                      <div className="flex aspect-square h-full w-full items-center justify-center bg-blue-200 sm:aspect-auto sm:min-h-[20rem] md:aspect-auto">
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
