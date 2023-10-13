'use client';

import { cn } from '@/lib/util';
import { sizesOptions } from '@/lib/validation/constants';
import * as RadioGroup from '@radix-ui/react-radio-group';
import { MinusIcon, MinusSquare, PlusIcon } from 'lucide-react';

const ProductAdd = () => {
  return (
    <div>
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
          {sizesOptions.map((size) => (
            <RadioGroup.Item
              key={size.value}
              className={cn(
                'min-w-[5.4rem] rounded-full bg-offwhite px-6 py-2 tracking-wide',
                'data-[state=checked]:bg-black data-[state=checked]:text-white',
                'transition-all duration-200',
                'hover:bg-black/10',
                'focus-visible:ring-2 focus-visible:ring-black data-[state=checked]:focus-visible:ring-offset-2 data-[state=checked]:focus-visible:ring-offset-white',
              )}
              value={size.value}
            >
              {size.label}
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
          <button
            className={cn(
              'col-span-2 h-full rounded-full bg-black text-white transition-all duration-200 hover:bg-black/80',
              'focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 focus-visible:ring-offset-white',
            )}
          >
            Add to Cart
          </button>
        </div>
      </form>
    </div>
  );
};
export default ProductAdd;
