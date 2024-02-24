'use client';

import { cn, priceFormat } from '@/lib/util';
import PaymentElements from './PaymentElements';
import { useRef } from 'react';
import { AnimatePresence, useInView, motion } from 'framer-motion';
import { Button } from '@/components/UI/Button';
import { ArrowLongDownIcon } from '@heroicons/react/16/solid';

const PaymentSectionClient = ({
  total,
  deliveryCharge,
  subtotal,
  taxes,
  totalDiscount,
}: {
  total: number;
  deliveryCharge: number;
  subtotal: number;
  taxes: number;
  totalDiscount: number;
}) => {
  const ref = useRef<null | HTMLDivElement>(null);
  const isView = useInView(ref, { amount: 0.1 });
  return (
    <div
      ref={ref}
      className={cn(
        'h-max rounded-main border-2 border-[hsl(0,0%,0%)] p-6 shadow-ghosting xl:p-8',
        // 'bg-primary-400 [&_*]:text-primary-0',
      )}
    >
      <AnimatePresence initial={false}>
        {!isView && (
          <Button
            onClick={() => {
              if (!ref) return;
              ref.current?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="fixed bottom-4 left-1/2 z-50 !transition-none lg:hidden"
            asChild
            key={'scroll-button'}
            roundness={'lg'}
          >
            <motion.button
              initial={{ y: 100, x: '-50%', opacity: 0 }}
              animate={{ y: 0, x: '-50%', opacity: 1 }}
              exit={{ y: 100, x: '-50%', opacity: 0 }}
            >
              <ArrowLongDownIcon className="size-4" />
              Scroll to Payment
            </motion.button>
          </Button>
        )}
      </AnimatePresence>
      <div className="space-y-1">
        <h2 className="text-xl font-semibold sm:text-2xl">Payment</h2>
        <p className="text-primary-400">
          View price details and make payment to confirm your order
        </p>
      </div>
      <div className="my-6 h-px w-full bg-primary-100"></div>
      <div className="">
        <div className="">
          <h3 className="mb-4 text-lg font-semibold sm:text-xl">Summary</h3>
          <div className="text-sm">
            <dl className="flex flex-col gap-2">
              <div className="flex justify-between">
                <dd className="font-medium text-primary-400">Subtotal</dd>
                <dd className="font-medium text-primary-500">
                  {priceFormat(subtotal)}
                </dd>
              </div>
              {totalDiscount > 0 && (
                <div className="flex justify-between">
                  <dd className="font-medium text-primary-400">Discount</dd>
                  <dd className="font-medium text-emerald-500">
                    {priceFormat(totalDiscount)}
                  </dd>
                </div>
              )}
              <div className="flex justify-between">
                <dd className="font-medium text-primary-400">
                  Delivery Charge
                </dd>
                <dd className="font-medium text-primary-500">
                  {priceFormat(deliveryCharge)}
                </dd>
              </div>
              <div className="flex justify-between">
                <dd className="font-medium text-primary-400">Taxes</dd>
                <dd className="font-medium text-primary-500">
                  {priceFormat(taxes)}
                </dd>
              </div>
              <div className="flex justify-between">
                <dd className="font-medium text-primary-400">Total</dd>
                <dd className="font-medium text-primary-500">
                  {priceFormat(total)}
                </dd>
              </div>
            </dl>
          </div>
        </div>
        <div className="my-6 h-px w-full bg-primary-100"></div>
        <div>
          <PaymentElements amount={total} />
        </div>
      </div>
    </div>
  );
};
export default PaymentSectionClient;
