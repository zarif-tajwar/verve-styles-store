'use client';

import { cn } from '@/lib/util';
import { MinusIcon, PlusIcon } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../UI/Button';

type CartQuantityCounterProps = {
  initial?: number;
  min?: number;
  max?: number;
  onChange?: (quantity: number) => void;
  className?: string;
  btnClassName?: string;
  inputName?: string;
};

const CartQuantityCounter = ({
  initial = 1,
  min = 1,
  max = 10,
  onChange,
  className,
  btnClassName,
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

  return (
    <div
      className={cn(
        'grid grid-cols-[auto_minmax(2ch,1fr)_auto] gap-1.5 overflow-hidden rounded-full bg-primary-50 p-1.5',
        className,
      )}
    >
      <Button
        onClick={(e) => {
          e.preventDefault();
          handleChange(quantity - 1);
        }}
        type="button"
        variant={'secondary'}
        size={'xs'}
      >
        <MinusIcon className="h-5 w-5" />
      </Button>
      <input
        type="number"
        className="h-full min-w-0 border-none bg-transparent text-center outline-none"
        max={max}
        min={min}
        value={quantity}
        name={inputName ? inputName : 'quantity'}
        readOnly
      />
      <Button
        onClick={(e) => {
          e.preventDefault();
          handleChange(quantity + 1);
        }}
        type="button"
        variant={'secondary'}
        size={'xs'}
      >
        <PlusIcon className="h-5 w-5" />
      </Button>
    </div>
  );
};
export default CartQuantityCounter;
