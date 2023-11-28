import { Loader } from 'lucide-react';
import Star from '../UI/Star';
import Spinner from '../UI/Spinner';

export const ProductListingSkeleton = () => {
  return (
    <div className="z-10 w-full origin-right opacity-50">
      {/* IMAGE */}
      <span className="relative z-0 mb-4 flex aspect-square min-w-full origin-right items-center justify-center overflow-hidden rounded-main bg-primary-100">
        <Spinner size={48} />
      </span>
      {/* TITLE */}
      <span className="mb-2 block h-[1.75rem] w-[80%] origin-right rounded-lg bg-primary-100 text-xl font-medium capitalize"></span>
      <div className="mb-2 flex items-start gap-3">
        <span className="inline-block h-5">
          <Star rating={5} size="sm" className="text-primary-100" />
        </span>
        <p className="flex h-[1.25rem] text-sm font-medium text-primary-300">
          <span className="block w-[3ch] origin-right rounded-md bg-primary-100 text-primary-500"></span>
          <span className="block">5.0</span>
        </p>
      </div>
      <span className="block h-[2rem] w-[7.5ch] origin-right rounded-md bg-primary-100 text-2xl font-semibold"></span>
    </div>
  );
};
