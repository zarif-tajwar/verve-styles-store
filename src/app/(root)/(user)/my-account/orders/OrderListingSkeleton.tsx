const OrderListingSkeleton = () => {
  return (
    <div className="animate-pulse space-y-10">
      {[...Array(4).keys()].map((_, i) => {
        return (
          <div
            key={i}
            className="grid gap-4 rounded-xl p-4 ring-1 ring-primary-100 xl:grid-cols-[1.2fr_auto_1fr]"
          >
            <div>
              <div className="mb-9 h-[4.25rem] rounded-lg bg-primary-100"></div>
              <div className="mb-9 h-[8.5rem] rounded-lg bg-primary-100"></div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="h-8 rounded-lg bg-primary-100"></div>
                <div className="h-8 rounded-lg bg-primary-100"></div>
              </div>
            </div>
            <div className="h-px w-full bg-primary-100 xl:h-full xl:w-px"></div>
            <div className="h-[19.25rem] overflow-hidden">
              <div className="flex h-max flex-col gap-4">
                <div className="grid h-[5.5rem] grid-cols-[auto_1fr] gap-4">
                  <div className="w-[5.5rem] rounded-lg bg-primary-100"></div>
                  <div className="rounded-lg bg-primary-100"></div>
                </div>
                <div className="h-px w-full bg-primary-100"></div>
                <div className="grid h-[5.5rem] grid-cols-[auto_1fr] gap-4">
                  <div className="w-[5.5rem] rounded-lg bg-primary-100"></div>
                  <div className="rounded-lg bg-primary-100"></div>
                </div>
                <div className="h-px w-full bg-primary-100"></div>
                <div className="grid h-[5.5rem] grid-cols-[auto_1fr] gap-4">
                  <div className="w-[5.5rem] rounded-lg bg-primary-100"></div>
                  <div className="rounded-lg bg-primary-100"></div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
export default OrderListingSkeleton;
