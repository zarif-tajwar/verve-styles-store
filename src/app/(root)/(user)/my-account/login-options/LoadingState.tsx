import Spinner from '@/components/UI/Spinner';

const LoadingState = () => {
  return (
    <div className="grid w-full grid-cols-2 gap-16">
      {[...Array(2).keys()].map((_, i) => {
        return (
          <div
            key={i}
            className="flex h-12 animate-pulse items-center justify-center rounded-lg bg-primary-50"
          >
            <Spinner />
          </div>
        );
      })}
    </div>
  );
};
export default LoadingState;
