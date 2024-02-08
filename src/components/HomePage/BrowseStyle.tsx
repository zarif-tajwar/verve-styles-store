import { cn } from '@/lib/util';
import Image from 'next/image';
import Link from 'next/link';
import { SectionHeading } from '../UI/Homepage';
import { Container } from '../UI/Container';
import { Section } from '../UI/Section';

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
        <div className="bg-offwhite px-4 py-12 md:rounded-[40px] md:px-8 md:py-12 lg:p-16">
          <SectionHeading>Browse by Dress Style</SectionHeading>
          <div className="space-y-4 md:space-y-5">
            {styleOptionPairs.map((styleOptions, pairIndex) => {
              return (
                <div
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
                      <Link
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
                          />
                        </div>
                      </Link>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </Container>
    </Section>
  );
};
export default BrowseStyle;
