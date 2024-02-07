import Link from 'next/link';
import React from 'react';
import { PartnerLogo } from '../Svgs/PartnerLogo';
import { buttonVariants } from '../UI/Button';
import { Container } from '../UI/Container';
import { cn } from '@/lib/util';
import { FullScreenSection } from '../UI/Section';
import Image from 'next/image';

const highlightedInfos = [
  '200+ International Brands',
  '2,000+ High-Quality Products',
  '3,0000+ Happy Customers',
];

const HighlightInfo = ({ children }: { children: string }) => {
  const [first, ...rest] = children.split(' ');

  return (
    <p className="flex flex-col gap-1.5">
      <span className="text-[2.5rem] font-bold leading-none text-black">
        {first}
      </span>{' '}
      {rest.join(' ')}
    </p>
  );
};

const Hero = () => {
  return (
    <FullScreenSection className="flex flex-col items-start justify-between bg-primary-50">
      <Container className="relative grid flex-grow grid-cols-1 overflow-y-hidden md:flex">
        {/* HERO CONTENT */}
        <div className="flex max-w-[37.5rem] flex-col items-start gap-8 py-16 container:py-24">
          <h1 className="font-integral-cf text-[clamp(2rem,1.4285714285714286rem+2.857142857142857vw,4rem)] font-bold leading-none">
            FIND CLOTHES <br /> THAT MATCHES <br /> YOUR STYLE
          </h1>
          <p className="text-balance text-base text-primary-400 md:text-lg">
            Browse through our diverse range of meticulously crafted garments,
            designed to bring out your individuality and cater to your sense of
            style.
          </p>
          <Link
            href="/shop"
            className={buttonVariants({
              size: 'xl',
              className: 'w-full max-w-[13rem]',
            })}
          >
            Shop Now
          </Link>
          <div className="mt-4 flex h-full text-primary-400">
            {highlightedInfos.map((info, i, arr) => (
              <React.Fragment key={info}>
                <HighlightInfo>{info}</HighlightInfo>
                {/* DIVIDER */}
                {i !== arr.length - 1 && (
                  <div className="mx-6 h-auto w-px bg-black/10"></div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
        {/* HERO IMAGE */}
        <div className="static bottom-0 right-[10%] flex-col items-end justify-end md:absolute md:flex md:h-full md:w-1/3">
          <div className="w-full md:h-[95%] md:w-max">
            <Image
              src={'/hero-image-model.png'}
              alt="A handsome yong man standing confidently wearing verve cloths."
              width={879}
              height={1440}
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </Container>
      <div className="w-full bg-black">
        <Container asChild>
          <div className="flex items-center justify-between py-11">
            <PartnerLogo.Versace />
            <PartnerLogo.Zara />
            <PartnerLogo.Gucci />
            <PartnerLogo.Prada />
            <PartnerLogo.CalvinKlein />
          </div>
        </Container>
      </div>
    </FullScreenSection>
  );
};
export default Hero;
