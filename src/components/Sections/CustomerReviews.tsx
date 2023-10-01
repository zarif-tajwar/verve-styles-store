'use client';

import { HTMLAttributes, useEffect, useState } from 'react';
import { Icons } from '../Svgs/icons';
import { cn } from '@/lib/util';
import { AnimatePresence, motion } from 'framer-motion';

const CustomerReviews = () => {
  const [currCard, setCurrCard] = useState(3);
  const [isVisible, setIsVisible] = useState(false);
  const cardsPerSlide = 3;

  const goLeft = () =>
    setCurrCard((currCard) => {
      if (currCard > 0) return currCard - cardsPerSlide;
      return currCard;
    });
  const goRight = () =>
    setCurrCard((currCard) => {
      if (currCard <= Reviews.length - 1 - cardsPerSlide)
        return currCard + cardsPerSlide;
      return currCard;
    });

  // const handleKeyboardControl = (e: globalThis.KeyboardEvent) => {
  //   if (!isVisible) return;

  //   if (e.key === 'ArrowRight') goRight();
  //   if (e.key === 'ArrowLeft') goLeft();
  // };

  // useEffect(() => {
  //   document.addEventListener('keydown', handleKeyboardControl);
  //   return () => document.removeEventListener('keydown', handleKeyboardControl);
  // }, [isVisible]);

  return (
    <section className="mt-20 overflow-x-hidden">
      <div>
        <div className="container-main flex items-end justify-between">
          <h2>Our Happy Customers</h2>
          <div className="flex items-center gap-2">
            <Arrow left onClick={goLeft} disabled={currCard === 0} />

            <Arrow
              onClick={goRight}
              disabled={currCard > Reviews.length - 1 - cardsPerSlide}
            />
          </div>
        </div>
        <div className="mt-10">
          <div className="container-main">
            <AnimatePresence initial={false}>
              <motion.div
                className="relative grid w-max cursor-grab touch-none select-none bg-white"
                style={{
                  gridTemplateColumns: `repeat(${Reviews.length}, 1fr)`,
                }}
                onViewportEnter={() => {
                  setIsVisible(true);
                }}
                onViewportLeave={() => {
                  setIsVisible(false);
                }}
                onPanStart={(_, info) => {
                  if (info.delta.x > 0) goLeft();
                  if (info.delta.x < 0) goRight();
                }}
              >
                {Reviews.map((review, i) => {
                  return (
                    <motion.div
                      animate={{
                        x: `${currCard * -100}%`,
                        transition: {
                          duration: 0.5,
                          filter: {
                            delay: 0.25,
                          },
                        },
                        opacity:
                          i >= currCard && i < currCard + cardsPerSlide
                            ? 1
                            : 0.4,
                      }}
                      key={i}
                      className={cn('relative z-50 h-full w-max bg-white pr-5')}
                    >
                      <ReviewCard
                        review={review}
                        className="h-full w-full max-w-[25rem]"
                      />
                    </motion.div>
                  );
                })}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};
export default CustomerReviews;

interface ArrowProps extends HTMLAttributes<HTMLButtonElement> {
  left?: boolean;
  className?: string;
  disabled?: boolean;
}

const Arrow = ({ left, className, disabled, ...props }: ArrowProps) => {
  return (
    <button
      className={cn(
        'flex aspect-square h-10 items-center justify-center rounded-full p-2 ring-1 ring-black/10 transition-all duration-200 hover:bg-offwhite hover:ring-offwhite',
        left && 'rotate-180',
        'outline-none focus-visible:ring-2 focus-visible:ring-black/70',
        'disabled:text-black/5 disabled:ring-black/5 disabled:hover:bg-transparent',
        className,
      )}
      disabled={disabled}
      {...props}
    >
      <Icons.arrow />
    </button>
  );
};

type Review = {
  name: string;
  quote: string;
};

const Reviews: Review[] = [
  {
    name: 'Sarah M.',
    quote:
      "I'm blown away by the quality and style of the clothes I received from Shop.co. From casual wear to elegant dresses, every piece I've bought has exceeded my expectations.",
  },
  {
    name: 'Alex K.',
    quote:
      'Finding clothes that align with my personal style used to be a challenge until I discovered Shop.co. The range of options they offer is truly remarkable, catering to a variety of tastes and occasions',
  },
  {
    name: 'James L.',
    quote:
      "As someone who's always on the lookout for unique fashion pieces, I'm thrilled to have stumbled upon Shop.co. The selection of clothes is not only diverse but also on-point with the latest trends.",
  },
  {
    name: 'Alex K.',
    quote:
      'Finding clothes that align with my personal style used to be a challenge until I discovered Shop.co. The range of options they offer is truly remarkable, catering to a variety of tastes and occasions',
  },
  {
    name: 'James L.',
    quote:
      "As someone who's always on the lookout for unique fashion pieces, I'm thrilled to have stumbled upon Shop.co. The selection of clothes is not only diverse but also on-point with the latest trends.",
  },
  {
    name: 'Alex K.',
    quote:
      'Finding clothes that align with my personal style used to be a challenge until I discovered Shop.co. The range of options they offer is truly remarkable, catering to a variety of tastes and occasions',
  },
  {
    name: 'Alex K.',
    quote:
      'Finding clothes that align with my personal style used to be a challenge until I discovered Shop.co. The range of options they offer is truly remarkable, catering to a variety of tastes and occasions',
  },
  {
    name: 'James L.',
    quote:
      "As someone who's always on the lookout for unique fashion pieces, I'm thrilled to have stumbled upon Shop.co. The selection of clothes is not only diverse but also on-point with the latest trends.",
  },
  {
    name: 'Alex K.',
    quote:
      'Finding clothes that align with my personal style used to be a challenge until I discovered Shop.co. The range of options they offer is truly remarkable, catering to a variety of tastes and occasions',
  },
];

interface ReviewCardProps extends HTMLAttributes<HTMLDivElement> {
  review: Review;
  className?: string;
}

const ReviewCard = ({ review, className, ...props }: ReviewCardProps) => {
  return (
    <div
      className={cn('rounded-main border border-black/10 px-8 py-7', className)}
      {...props}
    >
      <div className="flex gap-1.5 text-amber-400">
        <Icons.star />
        <Icons.star />
        <Icons.star />
        <Icons.star />
        <Icons.star />
      </div>
      <div className="mt-6 flex items-end gap-1">
        <p className="font-bold">{review.name}</p>
        <Icons.verified />
      </div>
      <blockquote className="mt-2 text-black/60">{review.quote}</blockquote>
    </div>
  );
};
