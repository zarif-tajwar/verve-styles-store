import React from 'react';
import { PartnerLogo } from '../Svgs/PartnerLogo';
import { Button } from '../UI/Button';

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
    <section className="flex h-[calc(100dvh-6rem)] flex-col items-start justify-between bg-offwhite">
      <div className="container-main flex-grow py-24">
        {/* HERO CONTENT */}
        <div className="flex max-w-[37.5rem] flex-col items-start gap-8">
          <h1 className="font-integral-cf text-[4rem] font-bold leading-none">
            FIND CLOTHES THAT MATCHES YOUR STYLE
          </h1>
          <p className="text-lg text-black/60">
            Browse through our diverse range of meticulously crafted garments,
            designed to bring out your individuality and cater to your sense of
            style.
          </p>
          <Button size={'xl'} className="w-full max-w-[13rem]">
            Shop Now
          </Button>
          <div className="mt-4 flex h-full text-black/60">
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
        <div></div>
      </div>
      <div className="w-full bg-black">
        <div className="container-main flex items-center justify-between py-11">
          <PartnerLogo.Versace />
          <PartnerLogo.Zara />
          <PartnerLogo.Gucci />
          <PartnerLogo.Prada />
          <PartnerLogo.CalvinKlein />
        </div>
      </div>
    </section>
  );
};
export default Hero;
