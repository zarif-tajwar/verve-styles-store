'use client';

import { useCheckoutStore } from '@/lib/store/checkout-store';
import * as RadioGroup from '@radix-ui/react-radio-group';
import ShippingAddressInputForm from './ShippingAddressInputForm';
import ShippingAddressSelect from './ShippingAddressSelect';
import { AddressSelect } from '@/lib/db/schema/address';
import { AnimatePresence, Variants, motion } from 'framer-motion';
import { CheckCircleIcon } from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleIconSolid } from '@heroicons/react/24/solid';

const animVariants: Variants = {
  hidden: {
    height: 0,
    opacity: 0,
    transition: { ease: 'easeOut', duration: 0.3 },
  },
  reveal: {
    height: 'auto',
    opacity: 1,
    transition: { ease: 'easeIn', duration: 0.3 },
  },
};

const ShippingAddressRadio = ({
  savedAddresses,
}: {
  savedAddresses: AddressSelect[];
}) => {
  const setShippingAddressMode = useCheckoutStore(
    (store) => store.setShippingAdressMode,
  );
  const shippingAddressMode = useCheckoutStore(
    (store) => store.shippingAddress.mode,
  );
  return (
    <div className="max-w-lg">
      <RadioGroup.Root
        onValueChange={(value) => {
          if (value === 'select' || value === 'input') {
            setShippingAddressMode(value);
          }
        }}
        value={shippingAddressMode}
      >
        <div className="grid items-center justify-start gap-x-4 gap-y-6 sm:grid-cols-[1.35fr_1fr]">
          <div className="flex items-center gap-3">
            <RadioGroup.Item
              value={'select'}
              className="group flex flex-shrink-0 flex-col justify-start"
              id={'select'}
            >
              <CheckCircleIcon className="size-6 text-primary-100 group-data-[state=checked]:hidden sm:size-7" />
              <CheckCircleIconSolid className="hidden size-6 text-primary-900 group-data-[state=checked]:block sm:size-7" />
            </RadioGroup.Item>
            <label htmlFor="select">
              <p className="text-base font-semibold sm:text-lg">
                Saved Addresses
              </p>
              <p className="text-sm text-primary-500">
                Choose from your saved addresses
              </p>
            </label>
          </div>
          <div className="flex items-center gap-3">
            <RadioGroup.Item
              value={'input'}
              className="group flex flex-shrink-0 flex-col justify-start"
              id={'input'}
            >
              <CheckCircleIcon className="size-6 text-primary-100 group-data-[state=checked]:hidden sm:size-7" />
              <CheckCircleIconSolid className="hidden size-6 text-primary-900 group-data-[state=checked]:block sm:size-7" />
            </RadioGroup.Item>
            <label htmlFor="input">
              <p className="text-base font-semibold sm:text-lg">
                Input Address
              </p>
              <p className="text-sm text-primary-500">
                Enter a different address
              </p>
            </label>
          </div>
        </div>
      </RadioGroup.Root>
      <div className="my-5 h-px w-full bg-primary-100"></div>
      <div className="">
        <AnimatePresence initial={false} mode="wait">
          {shippingAddressMode === 'input' && (
            <motion.div
              variants={animVariants}
              key={'input'}
              initial={'hidden'}
              animate={'reveal'}
              exit={'hidden'}
              className="overflow-hidden"
            >
              <ShippingAddressInputForm />
            </motion.div>
          )}
          {shippingAddressMode === 'select' && (
            <motion.div
              variants={animVariants}
              key={'select'}
              initial={'hidden'}
              animate={'reveal'}
              exit={'hidden'}
              className="overflow-hidden"
            >
              <ShippingAddressSelect savedAddresses={savedAddresses} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
export default ShippingAddressRadio;
