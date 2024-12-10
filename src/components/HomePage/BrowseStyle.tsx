'use client';

import { cn } from '@/lib/util';
import Image from 'next/image';
import Link from 'next/link';
import { SectionHeading } from '@/components/UI/Homepage';
import { Container } from '@/components/UI/Container';
import { Section } from '@/components/UI/Section';
import { type Variants, motion } from 'motion/react';

const MotionLink = motion.create(Link);

const staggerParentVariants: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const revealVariants: Variants = {
  initial: { y: '100%', opacity: '0%' },
  animate: {
    y: '0%',
    opacity: '100%',
    transition: {
      type: 'tween',
      ease: 'backInOut',
      duration: 0.7,
    },
  },
};

const styleOptionVariants: Variants = {
  initial: { y: '10%', opacity: '0%' },
  animate: {
    y: '0%',
    opacity: '100%',
    transition: {
      type: 'tween',
      ease: 'backInOut',
      duration: 0.7,
    },
  },
};

const BrowseStyle = () => {
  const styleOptionPairs = [
    [
      {
        text: 'Casual',
        image: '/casual-model.png',
        href: '/shop?styles=casual',
      },
      {
        text: 'Formal',
        image: '/formal-model.png',
        href: '/shop?styles=formal',
      },
    ],
    [
      {
        text: 'Festival',
        image: '/festival-model.png',
        href: '/shop?styles=festival',
      },
      { text: 'Gym', image: '/gym-model.png', href: '/shop?styles=gym' },
    ],
  ];
  return (
    <Section>
      <Container className="[@media(width<=768px)]:p-0">
        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, amount: 'some' }}
          variants={staggerParentVariants}
          className="rounded-[2.5rem] bg-offwhite px-4 py-12 md:px-8 md:py-12 lg:p-16"
        >
          <SectionHeading className="overflow-hidden">
            <motion.span className="inline-flex" variants={revealVariants}>
              Browse by Dress Style
            </motion.span>
          </SectionHeading>
          <div className="space-y-4 md:space-y-5">
            {styleOptionPairs.map((styleOptions, pairIndex) => {
              return (
                <motion.div
                  key={pairIndex}
                  className={cn(
                    'grid gap-4 md:gap-5',
                    (pairIndex + 1) % 2 !== 0
                      ? 'lg:grid-cols-[minmax(400px,auto)_1fr]'
                      : 'lg:grid-cols-[1fr_minmax(400px,auto)]',
                    'md:grid-cols-2',
                  )}
                >
                  {styleOptions.map((option, optionIndex) => {
                    return (
                      <MotionLink
                        variants={styleOptionVariants}
                        href={option.href}
                        key={optionIndex}
                        className={cn(
                          'relative grid h-[244px] overflow-hidden rounded-[1.25rem] bg-white p-5 lg:h-[290px] lg:px-9 lg:py-6',
                          '',
                        )}
                      >
                        <p className="text-3xl font-semibold lg:text-4xl">
                          {option.text}
                        </p>
                        <div className="absolute -right-20 top-0 aspect-[1.2/1] h-full">
                          <Image
                            src={option.image}
                            alt={`A handsome young man wearing verve's ${option.text} clothing`}
                            fill
                            className="object-cover object-left-bottom"
                            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, (max-width: 1024px) 25vw, 20vw"
                          />
                        </div>
                      </MotionLink>
                    );
                  })}
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </Container>
    </Section>
  );
};
export default BrowseStyle;
