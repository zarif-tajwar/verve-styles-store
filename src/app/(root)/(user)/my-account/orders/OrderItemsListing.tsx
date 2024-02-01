'use client';

import Divider from '@/components/UI/Divider';
import SizeBadge from '@/components/UI/SizeBadge';
import { UserOrderedProduct } from '@/lib/types/user';
import { priceFormat } from '@/lib/util';
import * as ScrollArea from '@radix-ui/react-scroll-area';

const OrderItemsListing = ({
  orderedProducts,
}: {
  orderedProducts: UserOrderedProduct[];
}) => {
  return (
    <ScrollArea.Root
      type="always"
      className="h-full max-h-[19.25rem] min-w-[24rem] rounded-xl text-sm transition-opacity"
    >
      <ScrollArea.Viewport className="h-full w-full rounded-t-lg">
        <div>
          {orderedProducts?.map((product, i, arr) => {
            return (
              <div key={i} className="relative">
                <div className="grid w-full grid-cols-[auto_1fr] gap-4 text-primary-400">
                  <div className="aspect-auto size-[5.5rem] rounded-lg bg-primary-50"></div>
                  <div className="flex flex-col justify-between">
                    <div className="flex gap-2">
                      <p className="mb-2 font-semibold">{product.name}</p>
                      <SizeBadge sizeText={product.size} />
                    </div>
                    <dl className="grid grid-cols-2">
                      <div className="space-y-0.5">
                        <dt className="font-semibold text-primary-300">
                          Quantity
                        </dt>
                        <dd className="font-medium text-primary-400">
                          x{product.quantity}
                        </dd>
                      </div>
                      <div className="space-y-0.5">
                        <dt className="font-semibold text-primary-300">
                          Total
                        </dt>
                        <dd className="font-semibold text-primary-400">
                          {priceFormat(product.total)}
                        </dd>
                      </div>
                    </dl>
                  </div>
                </div>

                {i < arr.length - 1 && (
                  <Divider className="my-4 w-full bg-primary-50" />
                )}
              </div>
            );
          })}
        </div>
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
