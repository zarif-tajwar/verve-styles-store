'use client';

import * as React from 'react';
import * as RadioGroup from '@radix-ui/react-radio-group';
import { CheckIcon, HomeIcon } from '@heroicons/react/20/solid';

const DefaultAddressRadioGroup = () => {
  return (
    <form>
      <RadioGroup.Root
        className="grid grid-cols-1 gap-4 text-sm leading-none"
        defaultValue="default"
        aria-label="Choose Default Address"
      >
        {[...Array(3).keys()].map((_, i) => {
          return (
            <label
              key={i}
              htmlFor={`value${i}`}
              className="flex items-start gap-3 rounded-xl p-3 ring-1 ring-primary-50 has-[:checked]:bg-primary-50 has-[:checked]:ring-1 has-[:checked]:ring-primary-300"
            >
              <RadioGroup.Item
                className="size-5"
                value={`value${i}`}
                id={`value${i}`}
              >
                <RadioGroup.Indicator asChild>
                  <CheckIcon className="text-primary-500" />
                </RadioGroup.Indicator>
              </RadioGroup.Item>
              <div className="w-full">
                <p className="mb-4 flex w-max items-center gap-2 text-base font-medium text-primary-500">
                  <HomeIcon className="h-4 w-4" />
                  Home
                </p>
                <dl className="grid w-full grid-cols-2 gap-x-8 gap-y-4">
                  <div className="space-y-2">
                    <dd className="font-medium text-primary-400 opacity-90">
                      Address
                    </dd>
                    <dt>2770 McDonald Avenue</dt>
                  </div>
                  <div className="space-y-2">
                    <dd className="font-medium text-primary-400 opacity-90">
                      City
                    </dd>
                    <dt>Paullina</dt>
                  </div>
                  <div className="space-y-2">
                    <dd className="font-medium text-primary-400 opacity-90">
                      Country
                    </dd>
                    <dt>United States</dt>
                  </div>
                  <div className="space-y-2">
                    <dd className="font-medium text-primary-400 opacity-90">
                      Phone
                    </dd>
                    <dt>+1407-936-6097</dt>
                  </div>
                </dl>
              </div>
            </label>
          );
        })}
      </RadioGroup.Root>
    </form>
  );
};
export default DefaultAddressRadioGroup;
