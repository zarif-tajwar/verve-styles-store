import { cn } from '@/lib/util';
import { StarIcon } from '../Svgs/icons';
import { HTMLAttributes } from 'react';

interface StarProps extends HTMLAttributes<HTMLSpanElement> {
  rating: number;
  maxRating?: number;
  size?: 'sm' | 'md';
}

const Star = ({
  rating,
  maxRating = 5,
  size = 'md',
  className,
  ...props
}: StarProps) => {
  return (
    <span
      className={cn(
        'flex items-center justify-center text-yellow-400',
        className,
      )}
      {...props}
    >
      {[...Array(maxRating).keys()].map((_, i) => {
        return (
          <span key={i} className={cn('relative inline-block')}>
            <StarIcon
              className={cn(
                size === 'sm' && 'h-5 w-5',
                size === 'md' && 'h-6 w-6',
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
              <StarIcon
                className={cn(
                  'absolute right-0 top-0 fill-none',
                  size === 'sm' && 'h-5 w-5',
                  size === 'md' && 'h-6 w-6',
                )}
              />
            ) : null}
          </span>
        );
      })}
    </span>
  );
};

export default Star;
