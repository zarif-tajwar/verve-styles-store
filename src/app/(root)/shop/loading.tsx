import { ProductListingSkeleton } from '@/components/ShopFilter/Skeleton';

const loading = () => {
  return (
    <>
      <div className="col-start-1 row-start-1"></div>
      <div className="relative col-span-2 h-max">
        <div
          key={'skeleton'}
          className="z-50 grid w-full animate-pulse grid-cols-3 gap-x-5 gap-y-9"
        >
          {[...Array(9).keys()].map((_, i) => (
            <ProductListingSkeleton key={i + 'skeleton'} />
          ))}
        </div>
      </div>
    </>
  );
};
export default loading;
