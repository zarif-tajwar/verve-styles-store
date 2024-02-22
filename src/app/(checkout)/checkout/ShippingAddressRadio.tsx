'use client';

import { useCheckoutStore } from '@/lib/store/checkout-store';
import * as RadioGroup from '@radix-ui/react-radio-group';
import ShippingAddressInputForm from './ShippingAddressInputForm';
import ShippingAddressSelect from './ShippingAddressSelect';
import { AddressSelect } from '@/lib/db/schema/address';
import { AnimatePresence, Variants, motion } from 'framer-motion';

const animVariants: Variants = {
  hidden: {
    height: 0,
    opacity: 0,
    transition: { ease: 'backOut', duration: 0.6 },
  },
  reveal: {
    height: 'auto',
    opacity: 1,
    transition: { ease: 'backIn', duration: 0.6 },
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
        <div className="grid items-center justify-start gap-x-4 gap-y-6 sm:grid-cols-2">
          <div className="flex items-center gap-3">
            <RadioGroup.Item
              id="select"
              value="select"
              className="relative inline-flex size-5 flex-shrink-0 items-center justify-center rounded-full border-2 border-primary-50 data-[state=checked]:border-primary-500"
            >
              <RadioGroup.Indicator className="absolute left-1/2 top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary-500" />
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
              id="input"
              value="input"
              className="relative inline-flex size-5 flex-shrink-0 items-center justify-center rounded-full border-2 border-primary-50 data-[state=checked]:border-primary-500"
            >
              <RadioGroup.Indicator className="absolute left-1/2 top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary-500" />
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
      <div className="my-5 h-px w-full bg-primary-50"></div>
      <div className="">
        <AnimatePresence initial={false}>
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
