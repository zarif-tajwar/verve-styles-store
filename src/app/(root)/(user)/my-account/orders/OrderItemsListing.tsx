'use client';

import Divider from '@/components/UI/Divider';
import { ScrollArea } from '@/components/UI/ScrollArea';
import SizeBadge from '@/components/UI/SizeBadge';
import { UserOrderedProduct } from '@/lib/types/user';
import { priceFormat } from '@/lib/util';
// import * as ScrollArea from '@radix-ui/react-scroll-area';
import Image from 'next/image';

const OrderItemsListing = ({
  orderedProducts,
}: {
  orderedProducts: UserOrderedProduct[];
}) => {
  return (
    <ScrollArea
      type="always"
      className="h-full rounded-l-xl text-sm transition-opacity"
      scrollBarClassName="w-2"
    >
      <div className="max-h-[300px]">
        {orderedProducts?.map((product, i, arr) => {
          return (
            <div key={i} className="relative">
              <div className="grid w-full grid-cols-[auto_1fr] gap-3 text-primary-400 sm:gap-4">
                <div className="relative size-[5.5rem] overflow-hidden rounded-lg bg-primary-50">
                  <Image
                    src={product.image}
                    alt={product.name}
                    className="object-cover"
                    fill
                  />
                </div>
                <div className="flex flex-col justify-between">
                  <div className="flex justify-start gap-x-2">
                    <p className="mb-2 line-clamp-1 font-semibold">
                      {product.name}
                    </p>
                    <SizeBadge
                      sizeText={product.size}
                      className="h-max min-w-max"
                    />
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
                      <dt className="font-semibold text-primary-300">Total</dt>
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
    </ScrollArea>
  );
};
export default OrderItemsListing;
