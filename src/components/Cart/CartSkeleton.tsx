import { cn } from '@/lib/util';

const CartSkeleton = () => {
  return (
    <div
      className={cn(
        'left-0 top-0 h-full w-full animate-pulse opacity-50',
        'grid h-full gap-x-5',
        'grid-cols-1 grid-rows-[1fr_22.875rem]',
        'lg:grid-cols-5 lg:grid-rows-none',
        'gap-y-4 sm:gap-y-5 md:gap-y-6',
      )}
    >
      <div className="h-full rounded-main border border-primary-100 p-4 sm:p-5 md:p-6 lg:col-span-3">
        <div className="relative h-full min-h-[24rem] w-full overflow-hidden">
          <div className="absolute -top-4 left-0 h-full w-full sm:-top-5 md:-top-6">
            {[...Array(5).keys()].map((_, i, arr) => {
              return (
                <div
                  key={i}
                  className="relative grid grid-cols-[auto_1fr] gap-x-4 py-4 sm:py-5 md:py-6"
                >
                  <div className="aspect-square size-[7rem] rounded-xl bg-primary-100 sm:size-[8rem]"></div>
                  <div className="rounded-xl bg-primary-100"></div>
                  <div
                    className={cn(
                      'absolute bottom-0 left-0 h-px w-full bg-primary-100',
                      i === arr.length - 1 && 'hidden',
                    )}
                  ></div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div className="grid max-h-[22.875rem] grid-rows-[auto_1fr] gap-y-4 rounded-main border border-primary-100 p-4 sm:gap-y-5 sm:p-5 md:gap-y-6 md:p-6 lg:col-span-2">
        <div className="h-10 rounded-lg bg-primary-100"></div>
        <div className="rounded-xl bg-primary-100"></div>
      </div>
    </div>
  );
};
export default CartSkeleton;
