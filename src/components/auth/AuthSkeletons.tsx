import { cn } from '@/lib/util';

export const AuthSkeletonButton = () => {
  return (
    <div className="h-10 w-full animate-pulse rounded-lg bg-primary-100" />
  );
};

export const AuthSkeletonForm = ({
  noMinHeight,
  fields = 2,
  includeLink = true,
}: {
  noMinHeight?: boolean;
  fields?: 1 | 2;
  includeLink?: boolean;
}) => {
  return (
    <>
      <div className="mb-8 flex flex-col justify-end gap-y-8">
        <div
          className={cn(
            'flex flex-col justify-center gap-y-6 sm:min-h-[13.5rem]',
            noMinHeight && 'sm:min-h-0',
          )}
        >
          {[...Array(fields).keys()].map((_, i) => {
            return (
              <div key={i} className="animate-pulse space-y-1.5">
                <div className="h-4 w-28 rounded-[0.25rem] bg-primary-100"></div>
                <div className="h-10 w-full rounded-lg bg-primary-100" />
              </div>
            );
          })}
        </div>
        <AuthSkeletonButton />
      </div>
      {includeLink && <div className="h-5 w-full"></div>}
    </>
  );
};
