'use client';

import useStar from '../../lib/hooks/useStar';
import { useRef } from 'react';
import Star from './Star';

const DynamicStar = () => {
  const starWrapperRef = useRef<HTMLButtonElement>(null);
  const maxRating = 10;

  const {
    selectedRating,
    handleClick,
    handleHover,
    handleHoverLeave,
    tempHoverRating,
  } = useStar({ starWrapperRef, maxRating });

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
      <Star rating={rating} maxRating={maxRating} />
    </button>
  );
};

export default DynamicStar;
