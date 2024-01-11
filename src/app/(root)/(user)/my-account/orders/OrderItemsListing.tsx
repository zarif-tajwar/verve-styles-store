'use client';

import Divider from '@/components/UI/Divider';
import { capitalize, cn, priceFormat } from '@/lib/util';
import * as ScrollArea from '@radix-ui/react-scroll-area';

const OrderItemsListing = () => {
  return (
    <ScrollArea.Root
      type="always"
      className="h-full max-h-[15rem] min-w-[24rem] rounded-xl text-sm opacity-30 transition-opacity duration-300 hover:opacity-100"
    >
      <ScrollArea.Viewport className="h-full w-full rounded-t-lg">
        {[...Array(10).keys()].map((_, i, arr) => {
          return (
            <div key={i} className="">
              <div className="grid w-full grid-cols-[auto_1fr] gap-4 text-primary-400">
                <div className="aspect-auto size-20 rounded-lg bg-primary-50"></div>
                <div>
                  <div className="mb-2 flex gap-2">
                    <p className="mb-2 font-semibold">A Cool Black T-Shirt</p>
                    <span className="mb-2 inline-flex min-w-[3rem] items-center justify-center rounded-full px-2 py-0.5 text-xs font-normal tracking-wide ring-1  ring-inset ring-primary-100">
                      {'small'.length > 3
                        ? capitalize('small')
                        : 'small'.toUpperCase()}
                    </span>
                  </div>
                  <dl className="grid grid-cols-2">
                    <div>
                      <dt className="font-semibold text-primary-300">
                        Quantity
                      </dt>
                      <dd className="font-medium text-primary-400">5</dd>
                    </div>
                    <div>
                      <dt className="font-semibold text-primary-300">
                        Subtotal
                      </dt>
                      <dd className="font-semibold text-primary-400">
                        $9999.99
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
              {i < arr.length - 1 && (
                <Divider className="my-4 w-full bg-primary-50" />
              )}
            </div>
            // <div key={i} className="border-0 outline-none ring-0">
            //   <div
            //     className={cn(
            //       'relative grid min-h-[2rem] grid-cols-[5rem_1fr_1fr] gap-4',
            //       i === arr.length - 1 && 'pb-4',
            //     )}
            //   >
            //     {/* IMAGE */}
            //     <div className="row-span-2 aspect-square rounded-lg bg-primary-50"></div>
            //     <div className="col-span-2 flex flex-col items-start justify-start gap-1.5">
            //       {/* PRODUCT NAME */}
            //       <span className="block font-medium">
            //         A cool black t-shirt
            //       </span>
            //       {/* ATTRIBUTES */}
            //       <span className="inline-flex min-w-[3rem] items-center justify-center rounded-full px-2 py-0.5 text-xs font-normal tracking-wide  ring-1 ring-primary-100">
            //         {'small'.length > 3
            //           ? capitalize('small')
            //           : 'small'.toUpperCase()}
            //       </span>
            //     </div>
            //     {/* QUANTITY */}
            //     <span className="inline-flex items-end">Quantity: 3</span>
            //     {/* TOTAL PRICE */}
            //     <span className="inline-flex items-end font-medium">
            //       {priceFormat(9999)}
            //     </span>
            //   </div>
            //   {i < arr.length - 1 && (
            //     <Divider className="my-4 w-full bg-primary-50" />
            //   )}
            // </div>
          );
        })}
      </ScrollArea.Viewport>
      <ScrollArea.Scrollbar
        className="flex w-2.5 touch-none select-none rounded-lg bg-primary-50 p-0.5 transition-colors duration-[160ms] ease-out hover:bg-primary-100"
        orientation="vertical"
      >
        <ScrollArea.Thumb className="relative flex-1 rounded-[10px] bg-primary-200 before:absolute before:left-1/2 before:top-1/2 before:h-full before:min-h-[44px] before:w-full before:min-w-[44px] before:-translate-x-1/2 before:-translate-y-1/2 before:content-['']" />
      </ScrollArea.Scrollbar>
    </ScrollArea.Root>
  );
};
export default OrderItemsListing;
