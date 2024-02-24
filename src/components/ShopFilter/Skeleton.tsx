import { FILTER_PRODUCTS_PER_PAGE } from '@/lib/validation/constants';
import Spinner from '../UI/Spinner';
import Star from '../UI/Star';
import { cn } from '@/lib/util';

export const ProductListingSkeleton = () => {
  return (
    <div className="animate-pulse">
      <div
        className={cn(
          'relative grid gap-x-4 gap-y-9 @container sm:gap-x-5',
          'grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3',
          '[@media(width<23.75rem)]:grid-cols-1',
          'auto-rows-auto',
        )}
      >
        {[...Array(FILTER_PRODUCTS_PER_PAGE).keys()].map((_, i) => {
          return (
            <div
              key={i}
              className="row-span-4 grid grid-rows-subgrid gap-x-0 gap-y-0"
            >
              <div className="relative mb-3 flex aspect-square w-full items-center justify-center overflow-hidden rounded-main bg-primary-100 sm:mb-4">
                <Spinner className="size-10" />
              </div>
              <div>
                <div className="mb-1 text-lg font-semibold capitalize leading-tight sm:text-xl lg:text-2xl">
                  <div className="h-[1lh] w-[80%] rounded-lg bg-primary-100"></div>
                </div>
              </div>
              <div className="mb-4 flex items-center gap-2 sm:gap-3">
                <Star rating={5} size="sm" className="text-primary-100" />
                <p className="flex text-sm font-medium text-primary-300 md:text-base">
                  <span className="block w-[2ch] rounded-lg bg-primary-100"></span>
                  <span className="block">/5.0</span>
                </p>
              </div>
              <div className="inline-block text-xl font-bold leading-none sm:text-2xl lg:font-bold">
                <div className="h-[1lh] w-[40%] rounded-lg bg-primary-100"></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
