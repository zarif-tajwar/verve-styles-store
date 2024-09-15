'use client';

import { PartnerLogo } from '@/components/Svgs/PartnerLogo';
import { AspectRatio } from '@/components/UI/AspectRatio';
import { Button } from '@/components/UI/Button';
import { Container } from '@/components/UI/Container';
import { Section } from '@/components/UI/Section';
import { cn } from '@/lib/util';
import { motion, type Variants } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

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

const highlightInfoParentVariants: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const highlightedInfoRevealParents: Variants = {
  initial: { scale: 0.7, opacity: '0%' },
  animate: {
    scale: 1,
    opacity: '100%',
    transition: {
      type: 'tween',
      ease: 'easeOut',
      duration: 0.3,
    },
  },
};

const highlightedInfos = [
  '200+ International Brands',
  '2,000+ High-Quality Products',
  '3,0000+ Happy Customers',
];

const HighlightInfo = ({
  children,
  noDivider,
}: {
  children: string;
  noDivider: boolean;
}) => {
  const [first, ...rest] = children.split(' ');

  return (
    <motion.div
      variants={highlightedInfoRevealParents}
      className="origin-bottom-left md:flex"
    >
      {!noDivider && (
        <div className="mx-3 hidden w-px bg-primary-200 md:block lg:mx-6"></div>
      )}
      <p className="flex flex-col gap-1 text-center md:text-left lg:gap-1.5">
        <span className="text-3xl font-bold leading-none text-primary-900 lg:text-4xl">
          {first}
        </span>
        <span className="text-sm lg:text-base lg:font-normal">
          {rest.join(' ')}
        </span>
      </p>
    </motion.div>
  );
};

const Hero = () => {
  return (
    <Section
      fullScreen
      noVerticalPadding
      className="flex flex-col items-start justify-between bg-primary-50"
    >
      <Container
        className={cn(
          'relative grid flex-grow grid-cols-1 overflow-y-hidden',
          'lg:grid-cols-5',
        )}
      >
        {/* HERO CONTENT */}
        <motion.div
          className={cn(
            'flex items-center py-10 md:py-16 container:py-24',
            'lg:col-span-3',
          )}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, amount: 0.3 }}
          variants={staggerParentVariants}
        >
          <div>
            <div
              className={cn(
                'pb-4 font-integral-cf font-bold lg:mb-8',
                'text-[clamp(2rem,10vw,4rem)] leading-[1.1]',
                'overflow-hidden whitespace-nowrap',
              )}
            >
              <motion.h1 variants={revealVariants}>
                FIND CLOTHES <br /> THAT MATCHES <br /> YOUR STYLE
              </motion.h1>
            </div>
            <div className="text-balance pb-10 text-base text-primary-400 sm:text-lg">
              <motion.p variants={revealVariants}>
                Browse through our diverse range of meticulously crafted
                garments, designed to bring out your individuality and cater to
                your sense of style.
              </motion.p>
            </div>
            <div className="mb-16 w-full md:max-w-[13rem]">
              <motion.div variants={revealVariants} className="w-full">
                <Button asChild size={'xl'} className="w-full">
                  <Link href="/shop">Shop Now</Link>
                </Button>
              </motion.div>
            </div>
            <motion.div
              variants={highlightInfoParentVariants}
              className="grid gap-y-6 text-primary-400 md:flex"
            >
              {highlightedInfos.map((info, i) => (
                <React.Fragment key={info}>
                  <HighlightInfo noDivider={i === 0}>{info}</HighlightInfo>
                </React.Fragment>
              ))}
            </motion.div>
          </div>
        </motion.div>
        {/* HERO IMAGE */}

        <div
          className={
            'grid place-items-center items-end lg:col-span-2 lg:place-items-end'
          }
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{
              opacity: 1,
              scale: 1,
              transition: {
                duration: 0.4,
                ease: 'easeOut',
              },
            }}
            viewport={{ once: true, amount: 0.3 }}
            className="w-full max-w-[20rem] origin-bottom lg:max-w-[26rem]"
          >
            <AspectRatio ratio={879 / 1440}>
              <Image
                src={'/hero-image-model.png'}
                alt="A handsome yong man standing confidently wearing verve cloths."
                width={879}
                height={1440}
                className="h-full w-full object-cover"
                priority={true}
                loading="eager"
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 70vw, (max-width: 1280px) 30vw, 20vw"
              />
            </AspectRatio>
          </motion.div>
        </div>
      </Container>
      <div className="w-full bg-black">
        <Container className="py-6 md:py-10">
          <div
            className={
              'flex flex-wrap justify-evenly gap-y-6 [--logo-height:clamp(1.25rem,-0.3377862595419847rem+2.6717557251908395vw,2rem)] md:flex-nowrap md:justify-between'
            }
          >
            <PartnerLogo.Versace className="h-[var(--logo-height)] basis-1/3 md:basis-auto" />
            <PartnerLogo.Zara className="h-[var(--logo-height)] basis-1/3 md:basis-auto" />
            <PartnerLogo.Gucci className="h-[var(--logo-height)] basis-1/3 md:basis-auto" />
            <PartnerLogo.Prada className="h-[var(--logo-height)] basis-1/2 md:basis-auto" />
            <PartnerLogo.CalvinKlein className="h-[var(--logo-height)] basis-1/2 md:basis-auto" />
          </div>
        </Container>
      </div>
    </Section>
  );
};
export default Hero;
