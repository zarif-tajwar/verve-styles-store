'use client';

import { HTMLAttributes, useEffect, useState } from 'react';
import { cn } from '@/lib/util';
import { AnimatePresence, motion } from 'framer-motion';
import { Button } from '../UI/Button';
import Star from '../UI/Star';
import { ArrowRight } from 'lucide-react';
import { Verified } from '../Svgs/icons';

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

  const handleKeyboardControl = (e: globalThis.KeyboardEvent) => {
    if (!isVisible) return;
    if (document.activeElement?.tagName === 'INPUT') return;

    if (e.key === 'ArrowRight') goRight();
    if (e.key === 'ArrowLeft') goLeft();
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyboardControl);
    return () => document.removeEventListener('keydown', handleKeyboardControl);
  }, [isVisible]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <section className="mt-20 overflow-x-hidden" id="reviews">
      <div className="container-main">
        <div className="flex w-full items-end justify-between">
          <h2>Our Happy Customers</h2>
          <div className="flex select-none items-center gap-2">
            <Button
              variant={'outline'}
              size={'square'}
              className="rotate-180 select-none"
              disabled={currCard === 0}
              onClick={goLeft}
              aria-hidden={currCard === 0}
              aria-label="Go right"
            >
              <ArrowRight />
            </Button>
            <Button
              variant={'outline'}
              size={'square'}
              disabled={currCard > Reviews.length - 1 - cardsPerSlide}
              aria-hidden={currCard > Reviews.length - 1 - cardsPerSlide}
              aria-label="Go left"
              onClick={goRight}
              className="select-none"
            >
              <ArrowRight />
            </Button>
          </div>
        </div>
        <div className="mt-10">
          <AnimatePresence initial={false}>
            <motion.div
              className="relative h-[17rem] w-full cursor-grab touch-none select-none gap-y-5 bg-primary-0"
              // style={{
              //   gridTemplateColumns: `repeat(${Reviews.length}, 1fr)`,
              // }}
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
                const isNotHighlighted = !(
                  i >= currCard && i < currCard + cardsPerSlide
                );
                return (
                  <motion.div
                    animate={{
                      x: `calc(${(i - currCard) * 100}% + ${
                        (i - currCard) * 1.25
                      }rem)`,
                      opacity: isNotHighlighted ? 0.4 : 1,
                    }}
                    transition={{ type: 'spring', bounce: 0.2 }}
                    key={i}
                    className={cn(
                      'absolute z-50 h-full w-[32.34%] bg-primary-0',
                    )}
                    aria-disabled={isNotHighlighted}
                  >
                    <ReviewCard review={review} className="h-full w-full" />
                  </motion.div>
                );
              })}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};
export default CustomerReviews;

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
      className={cn(
        'rounded-main border border-primary-100 px-8 py-7',
        className,
      )}
      {...props}
    >
      <Star rating={5} />
      <div className="mt-5 flex items-center gap-2">
        <p className="font-bold">{review.name}</p>
        <Verified />
      </div>
      <blockquote className="mt-2 line-clamp-5 leading-relaxed text-primary-400">
        {review.quote}
      </blockquote>
    </div>
  );
};
