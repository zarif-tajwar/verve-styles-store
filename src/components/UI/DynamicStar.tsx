'use client';

import useStar from '../../lib/hooks/useStar';
import { useRef } from 'react';
import Star from './Star';
import { Slot } from '@radix-ui/react-slot';

const DynamicStar = () => {
  const starWrapperRef = useRef<HTMLButtonElement>(null);

  const {
    selectedRating,
    handleClick,
    handleHover,
    handleHoverLeave,
    tempHoverRating,
  } = useStar({ starWrapperRef, maxRating: 10 });

  const rating =
    tempHoverRating !== undefined ? tempHoverRating : selectedRating;

  return (
    <button
      ref={starWrapperRef}
      onClick={handleClick}
      onMouseMove={handleHover}
      onMouseLeave={handleHoverLeave}
      className="flex cursor-pointer flex-col border-none outline-none"
    >
      <Star rating={rating} maxRating={10} />
    </button>
  );
};

export default DynamicStar;
