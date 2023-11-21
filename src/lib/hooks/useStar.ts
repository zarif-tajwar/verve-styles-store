'use client';

import { MouseEvent, RefObject, useState } from 'react';

const useStar = <T extends HTMLElement>({
  maxRating = 5,
  selectOnce = false,
  starWrapperRef,
}: {
  maxRating?: number;
  selectOnce?: boolean;
  starWrapperRef: RefObject<T>;
}) => {
  const [selectedRating, setSelectedRating] = useState<number>(0);
  const [tempHoverRating, setTempHoverRating] = useState<number | undefined>(
    undefined,
  );

  const getRating = (e: MouseEvent<T, globalThis.MouseEvent>) => {
    if (!starWrapperRef.current) return;

    const mouseX = e.clientX;

    const containerRect = starWrapperRef.current.getBoundingClientRect();
    const containerX = containerRect.x;

    const containerWidth = containerRect.width;

    const mouseRelativeX = mouseX - containerX;

    const rating =
      Math.ceil((mouseRelativeX / containerWidth) * (maxRating * 2)) / 2;

    return rating;
  };

  const handleHover = (e: MouseEvent<T, globalThis.MouseEvent>) => {
    if (selectOnce && selectedRating > 0) return;
    const calcRating = getRating(e);
    if (calcRating === undefined) return;
    setTempHoverRating(calcRating);
  };

  const handleHoverLeave = () => {
    if (selectOnce && selectedRating > 0) return;
    setTempHoverRating(undefined);
  };

  const handleClick = (e: MouseEvent<T, globalThis.MouseEvent>) => {
    if (selectOnce && selectedRating > 0) return;
    const calcRating = getRating(e);
    if (calcRating === undefined) return;
    setSelectedRating(calcRating);
  };

  return {
    selectedRating,
    tempHoverRating,
    handleHover,
    handleHoverLeave,
    handleClick,
  };
};

export default useStar;
