'use client';

import { capitalize, cn } from '@/lib/util';
import { sizesOptions as lol } from '@/lib/validation/constants';
import * as RadioGroup from '@radix-ui/react-radio-group';
import { MinusIcon, MinusSquare, PlusIcon } from 'lucide-react';
import { Button, buttonVariants } from './Button';

const ProductAddCartRadioGroup = ({
  sizeOptions,
}: {
  sizeOptions: string[];
}) => {
  return (
    <form action="" onSubmit={(e) => e.preventDefault()}>
      <label
        htmlFor="clothing-size"
        className="mb-4 block font-medium leading-none text-black/60"
      >
        Choose Size
      </label>
      <RadioGroup.Root
        required
        aria-label="Cloth size options"
        className="flex max-w-[19rem] flex-wrap gap-3 text-sm"
        orientation="horizontal"
        name="size"
        id="clothing-size"
      >
        {sizeOptions.map((value) => (
          <RadioGroup.Item
            key={value}
            className={buttonVariants({
              align: 'left',
              variant: 'secondary',
              roundness: 'default',
              className:
                'px-6 data-[state=checked]:bg-primary-900 data-[state=checked]:text-primary-0',
            })}
            value={value}
          >
            {value.match(/xl/g) ? value.toUpperCase() : capitalize(value)}
          </RadioGroup.Item>
        ))}
      </RadioGroup.Root>
      <div className="my-6 h-px w-full bg-black/10" />
      <div className="grid h-[3.25rem] w-full grid-cols-3 gap-5 font-medium">
        <div className="grid grid-cols-3 gap-1 overflow-hidden rounded-full bg-offwhite p-1.5 text-black">
          <button
            className={cn(
              'flex h-full w-full items-center justify-center rounded-full',
              'transition-all duration-200 hover:bg-black hover:text-white',
            )}
            onClick={(e) => e.preventDefault()}
          >
            <MinusIcon className="h-5 w-5" />
          </button>
          <input
            type="number"
            className="h-full w-full border-none bg-transparent text-center outline-none"
            max={10}
            min={1}
            defaultValue={1}
          />
          <button
            className={cn(
              'flex h-full w-full items-center justify-center rounded-full',
              'transition-all duration-200 hover:bg-black hover:text-white',
            )}
            onClick={(e) => {
              e.preventDefault();
            }}
          >
            <PlusIcon className="h-5 w-5" />
          </button>
        </div>
        <Button className={'col-span-2 w-full'}>Add to Cart</Button>
      </div>
    </form>
  );
};
export default ProductAddCartRadioGroup;
