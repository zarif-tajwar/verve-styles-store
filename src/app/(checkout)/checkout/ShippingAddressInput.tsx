'use client';

import AddressInputForm from '@/app/(root)/(user)/my-account/addresses/AddressInputForm';
import { useCheckoutStore } from '@/lib/store/checkout-store';
import { cn } from '@/lib/util';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@radix-ui/react-accordion';
import { useShallow } from 'zustand/react/shallow';
import ShippingAddressInputForm from './ShippingAddressInputForm';

const ShippingAddressInput = () => {
  const mode = useCheckoutStore(
    useShallow((store) => store.shippingAddress.mode),
  );
  const isActive = mode === 'input';
  const setMode = useCheckoutStore((store) => store.setShippingAdressMode);
  return (
    <div className="relative">
      <AccordionItem
        value="input"
        className={cn(
          'relative overflow-hidden rounded-xl bg-primary-0 shadow-sm transition-colors duration-300',
          !isActive && 'hover:bg-primary-50',
        )}
      >
        <AccordionTrigger className="w-full px-6 ">
          <div className="py-6 text-left">
            <h3 className="text-lg font-semibold">Input Address</h3>
            <p className="text-sm text-primary-500">
              Enter a different address
            </p>
          </div>
        </AccordionTrigger>
        <AccordionContent className="data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
          <ShippingAddressInputForm className="px-6 pb-6" />
        </AccordionContent>
      </AccordionItem>
      {isActive && (
        <CheckCircleIcon className="absolute left-0 top-0 size-8 -translate-x-1/2 -translate-y-1/2" />
      )}
    </div>
  );
};
export default ShippingAddressInput;
