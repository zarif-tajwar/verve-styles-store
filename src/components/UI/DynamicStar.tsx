'use client';

import { cn } from '@/lib/util';
import { MouseEvent, SVGProps, useRef, useState } from 'react';

const Star = () => {
  const [selectedRating, setSelectedRating] = useState<number>(0);
  const [tempHoverRating, setTempHoverRating] = useState<number | undefined>(
    undefined,
  );
  const starParentRef = useRef<HTMLDivElement>(null);

  const getRating = (e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>) => {
    if (!starParentRef.current) return;

    const mouseX = e.clientX;

    const containerRect = starParentRef.current.getBoundingClientRect();
    const containerX = containerRect.x;

    const containerWidth = containerRect.width;

    const mouseRelativeX = mouseX - containerX;

    const rating = Math.ceil((mouseRelativeX / containerWidth) * 10) / 2;

    return rating;
  };

  return (
    <div className="relative">
      <div
        ref={starParentRef}
        onMouseMove={(e) => {
          const calcRating = getRating(e);
          if (calcRating === undefined) return;
          setTempHoverRating(calcRating);
        }}
        onMouseLeave={() => {
          setTempHoverRating(undefined);
        }}
        onClick={(e) => {
          const calcRating = getRating(e);
          if (calcRating === undefined) return;
          setSelectedRating(calcRating);
        }}
        className="cursor-pointer py-2"
      >
        <div className="flex items-center justify-center">
          {[...Array(5).keys()].map((_, i) => {
            const rating =
              tempHoverRating !== undefined ? tempHoverRating : selectedRating;

            return (
              <span
                key={i}
                className={cn('relative inline-block text-yellow-400')}
              >
                <StarIcon
                  className={cn(
                    rating && i + 1 <= rating && 'fill-current',
                    rating &&
                      i + 1 === Math.ceil(rating) &&
                      !Number.isInteger(rating) &&
                      'slice-half fill-current',
                  )}
                />
                {rating &&
                i + 1 === Math.ceil(rating) &&
                !Number.isInteger(rating) ? (
                  <StarIcon className="absolute right-0 top-0 fill-none" />
                ) : null}
              </span>
            );
          })}
        </div>
      </div>

      <div className="absolute -right-40 -top-40">
        <p>Rating: {selectedRating}</p>
      </div>
    </div>
  );
};

export default Star;

interface StarIconProps extends SVGProps<SVGSVGElement> {
  className?: string;
}

const StarIcon = ({ className, ...props }: StarIconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className={cn('h-6 w-6', className)}
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
      />
    </svg>
  );
};
