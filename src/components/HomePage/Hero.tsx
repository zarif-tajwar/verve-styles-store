import { cn } from '@/lib/util';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { PartnerLogo } from '../Svgs/PartnerLogo';
import { Button } from '../UI/Button';
import { Container } from '../UI/Container';
import { FullScreenSection } from '../UI/Section';

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
    <div className="md:flex">
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
    </div>
  );
};

const Hero = () => {
  return (
    <FullScreenSection className="flex flex-col items-start justify-between bg-primary-50">
      <Container
        className={cn(
          'relative grid flex-grow grid-cols-1 overflow-y-hidden',
          'md:grid-cols-5',
        )}
      >
        {/* HERO CONTENT */}
        <div
          className={cn(
            'flex items-center py-10 md:py-16 container:py-24',
            'md:col-span-3',
          )}
        >
          <div>
            <h1
              className={cn(
                'mb-4 font-integral-cf font-bold lg:mb-8',
                'text-[clamp(2rem,10vw,4rem)] leading-[1.1]',
                'whitespace-nowrap',
              )}
            >
              FIND CLOTHES <br /> THAT MATCHES <br /> YOUR STYLE
            </h1>
            <p className="mb-10 text-balance text-base text-primary-400 sm:text-lg">
              Browse through our diverse range of meticulously crafted garments,
              designed to bring out your individuality and cater to your sense
              of style.
            </p>
            <Button
              asChild
              size={'xl'}
              className="mb-16 w-full md:max-w-[13rem]"
            >
              <Link href="/shop">Shop Now</Link>
            </Button>
            <div className="grid gap-y-6 text-primary-400 md:flex">
              {highlightedInfos.map((info, i) => (
                <React.Fragment key={info}>
                  <HighlightInfo noDivider={i === 0}>{info}</HighlightInfo>
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
        {/* HERO IMAGE */}
        <div
          className={cn(
            'md:h-full',
            'flex items-end justify-center md:justify-end',
            'md:col-span-2 md:mr-[10%]',
            'md:pt-4',
          )}
        >
          <div
            className={cn(
              'md:w-auto md:max-w-[26rem]',
              'flex items-end',
              'w-full max-w-[16rem]',
            )}
          >
            <Image
              src={'/hero-image-model.png'}
              alt="A handsome yong man standing confidently wearing verve cloths."
              width={879}
              height={1440}
              className="object-scale-down object-right-bottom"
            />
          </div>
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
    </FullScreenSection>
  );
};
export default Hero;
