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
      <div>
        <div className="container-main flex items-end justify-between">
          <h2>Our Happy Customers</h2>
          <div className="flex items-center gap-2">
            <Button
              variant={'outline'}
              size={'square'}
              className="rotate-180"
              disabled={currCard === 0}
              onClick={goLeft}
            >
              <ArrowRight />
            </Button>
            <Button
              variant={'outline'}
              size={'square'}
              disabled={currCard > Reviews.length - 1 - cardsPerSlide}
              onClick={goRight}
            >
              <ArrowRight />
            </Button>
          </div>
        </div>
        <div className="mt-10">
          <div className="container-main">
            <AnimatePresence initial={false}>
              <motion.div
                className="relative grid w-max cursor-grab touch-none select-none bg-primary-0"
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
                      className={cn(
                        'relative z-50 h-full w-max bg-primary-0 pr-5',
                      )}
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
      <blockquote className="mt-2 leading-relaxed text-primary-400">
        {review.quote}
      </blockquote>
    </div>
  );
};
