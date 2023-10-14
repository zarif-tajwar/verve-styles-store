'use client';

import useStar from './useStar';
import { useRef } from 'react';
import Star from './Star';

const DynamicStar = () => {
  const starParentRef = useRef<HTMLButtonElement>(null);

  const {
    selectedRating,
    handleClick,
    handleHover,
    handleHoverLeave,
    tempHoverRating,
  } = useStar({ starParentRef });

  const rating =
    tempHoverRating !== undefined ? tempHoverRating : selectedRating;

  return (
    <button
      ref={starParentRef}
      onClick={handleClick}
      onMouseMove={handleHover}
      onMouseLeave={handleHoverLeave}
      className="block cursor-pointer border-none outline-none"
    >
      <Star rating={rating} maxRating={5} />
    </button>
  );
};

export default DynamicStar;
