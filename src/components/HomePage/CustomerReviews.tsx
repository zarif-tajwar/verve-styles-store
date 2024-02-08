'use client';

import {
  HTMLAttributes,
  useEffect,
  useState,
  useCallback,
  useRef,
} from 'react';
import { cn } from '@/lib/util';
import { useInView } from 'framer-motion';
import { Button } from '../UI/Button';
import Star from '../UI/Star';
import { ArrowRight } from 'lucide-react';
import { Verified } from '../Svgs/icons';
import {
  Carousel,
  CarouselApi,
  CarouselButtons,
  CarouselContent,
  CarouselItem,
  CarouselViewport,
} from '../UI/Carousel';
import { Container } from '../UI/Container';
import { SectionHeading } from '../UI/Homepage';
import { Section } from '../UI/Section';

const CustomerReviews = () => {
  const [api, setApi] = useState<CarouselApi>();
  const carouselRef = useRef<null | HTMLDivElement>(null);
  const isVisible = useInView(carouselRef);

  const scrollPrev = useCallback(() => {
    api?.scrollPrev();
  }, [api]);

  const scrollNext = useCallback(() => {
    api?.scrollNext();
  }, [api]);

  const handleKeyboardControl = useCallback(
    (e: globalThis.KeyboardEvent) => {
      if (!isVisible) return;
      if (document.activeElement?.tagName === 'INPUT') return;

      if (e.key === 'ArrowRight') scrollNext();
      if (e.key === 'ArrowLeft') scrollPrev();
    },
    [isVisible, scrollNext, scrollPrev],
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyboardControl);
    return () => document.removeEventListener('keydown', handleKeyboardControl);
  }, [isVisible, handleKeyboardControl]);

  return (
    <Section className="overflow-x-clip pb-24 md:pb-32 lg:pb-40" id="reviews">
      <Container className="relative">
        <div>
          <Carousel
            opts={{
              align: 'center',
              startIndex: 1,
              dragFree: true,
              slidesToScroll: 1,
              breakpoints: {
                '(min-width: 768px)': {
                  slidesToScroll: 3,
                },
              },
            }}
            setApi={setApi}
            ref={carouselRef}
          >
            <SectionHeading className="text-left">
              Our Happy Customers
            </SectionHeading>
            <CarouselViewport>
              <CarouselContent className="-ml-5 cursor-grab">
                {Reviews.map((review, i) => {
                  return (
                    <CarouselItem
                      key={i}
                      className="pl-5 sm:basis-1/2 lg:basis-1/3"
                    >
                      <ReviewCard review={review} className="h-full w-full" />
                    </CarouselItem>
                  );
                })}
              </CarouselContent>
            </CarouselViewport>
            <div className="mt-10 flex justify-center">
              <CarouselButtons className="right-0 top-1.5 md:absolute" />
            </div>
          </Carousel>
        </div>
      </Container>
    </Section>
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
        'rounded-main border border-primary-100 @container/card',
        className,
      )}
      {...props}
    >
      <div className="p-6 @[400px]/card:p-8">
        <Star rating={5} />
        <div className="mt-5 flex items-center gap-2">
          <p className="font-bold">{review.name}</p>
          <Verified />
        </div>
        <blockquote className="mt-2 line-clamp-5 leading-relaxed text-primary-400">
          {review.quote}
        </blockquote>
      </div>
    </div>
  );
};
