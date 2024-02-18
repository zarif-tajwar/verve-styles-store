import { ProductListingSkeleton } from '@/components/ShopFilter/Skeleton';

const loading = () => {
  return (
    <>
      <div className="col-start-1 row-start-1"></div>
      <div className="relative col-span-2 h-max">
        <ProductListingSkeleton />
      </div>
    </>
  );
};
export default loading;
