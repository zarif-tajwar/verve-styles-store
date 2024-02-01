import { cn } from '@/lib/util';

const ProductAddSkeleton = () => {
  return (
    <div className="animate-pulse">
      <p className="mb-4 block font-medium leading-none text-black/60">
        Choose Size
      </p>
      <div className="grid max-w-[19rem] grid-cols-5 grid-rows-2 flex-wrap gap-3 text-sm">
        {[...Array(5).keys()].map((i) => {
          return (
            <span
              key={i}
              className={cn(
                'h-9 rounded-full bg-primary-100',
                i === 0 && 'col-span-2',
                i === 1 && 'col-span-3',
                i === 2 && 'col-span-2',
                i === 3 && 'col-span-1',
                i === 4 && 'col-span-2',
              )}
            ></span>
          );
        })}
      </div>
      <div className="my-6 h-px w-full bg-black/10" />
      <div className="grid grid-cols-3 gap-5">
        <div className="h-[3.25rem] rounded-full bg-primary-100"></div>
        <div className="col-span-2 h-[3.25rem] rounded-full bg-primary-100"></div>
      </div>
    </div>
  );
};
export default ProductAddSkeleton;
