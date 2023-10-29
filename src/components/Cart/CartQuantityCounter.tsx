'use client';

import { cn } from '@/lib/util';
import { MinusIcon, PlusIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

type CartQuantityCounterProps = {
  initial?: number;
  min?: number;
  max?: number;
  onChange?: (quantity: number) => void;
  className?: string;
  inputName?: string;
};

const CartQuantityCounter = ({
  initial = 1,
  min = 1,
  max = 10,
  onChange,
  className,
  inputName,
}: CartQuantityCounterProps) => {
  const [quantity, setQuantity] = useState(initial);

  const handleChange = (newQuantity: number) => {
    let newQuantityCopy = newQuantity;

    if (Number.isNaN(quantity)) {
      newQuantityCopy = initial;
    }

    if (newQuantityCopy < min) {
      newQuantityCopy = min;
    }

    if (newQuantityCopy > max) {
      newQuantityCopy = max;
    }

    setQuantity(newQuantityCopy);

    if (onChange) {
      onChange(newQuantityCopy);
    }
  };

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     if (quantity < min) {
  //       handleChange(min);
  //     }

  //     if (quantity > max) {
  //       handleChange(max);
  //     }
  //   }, 500);

  //   return () => {
  //     clearInterval(interval);
  //   };
  // }, [quantity, max, min]);

  return (
    <div
      className={cn(
        'grid h-12 max-w-[160px] grid-cols-3 gap-1 overflow-hidden rounded-full bg-primary-50 p-1.5 text-primary-900',
        className,
      )}
    >
      <button
        className={cn(
          'flex h-full w-full items-center justify-center rounded-full',
          'transition-all duration-200 hover:bg-primary-100 active:bg-primary-200',
        )}
        onClick={(e) => {
          e.preventDefault();
          handleChange(quantity - 1);
        }}
      >
        <MinusIcon className="h-5 w-5" />
      </button>
      <input
        type="number"
        className="h-full w-full border-none bg-transparent text-center outline-none"
        max={max}
        min={min}
        value={quantity}
        onChange={(e) => setQuantity(Number.parseInt(e.target.value))}
        name={inputName ? inputName : 'quantity'}
      />
      <button
        className={cn(
          'flex h-full w-full items-center justify-center rounded-full',
          'transition-all duration-200 hover:bg-primary-100 active:bg-primary-200',
        )}
        onClick={(e) => {
          e.preventDefault();
          handleChange(quantity + 1);
        }}
      >
        <PlusIcon className="h-5 w-5" />
      </button>
    </div>
  );
};
export default CartQuantityCounter;
