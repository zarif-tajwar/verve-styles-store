'use client';

import { BookUser, FileClock, KeyRound, UserRoundCog } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselViewport,
} from '../UI/Carousel';
import { Button } from '../UI/Button';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/util';

const linksOptions = [
  { icon: FileClock, text: 'Orders', href: '/my-account/orders' },
  { icon: BookUser, text: 'Address Book', href: '/my-account/addresses' },

  {
    icon: KeyRound,
    text: 'Email & Accounts',
    href: '/my-account/login-options',
  },
  {
    icon: UserRoundCog,
    text: 'Preferences',
    href: '/my-account/preferences',
  },
];

const AccountMenuMobile = () => {
  const pathname = usePathname();

  const activeLinkIndex = linksOptions.findIndex((linkOption) =>
    pathname.includes(linkOption.href),
  );
  const carouselIndex = activeLinkIndex !== -1 ? activeLinkIndex : 0;

  return (
    <div className="lg:hidden">
      <Carousel opts={{ dragFree: true, startIndex: carouselIndex }}>
        <CarouselViewport>
          <CarouselContent className="-ml-[var(--gap)] [--gap:0.625rem]">
            {linksOptions.map((linkOption, i) => {
              return (
                <CarouselItem
                  key={linkOption.href}
                  className="basis-[max(25%,10rem)] pl-[var(--gap)] sm:basis-[max(25%,11rem)]"
                >
                  <Button
                    variant={'outline'}
                    className={cn(
                      'grid w-full grid-cols-1 items-start justify-start whitespace-nowrap break-keep px-3 text-left text-sm font-medium sm:px-4 sm:text-base',
                      activeLinkIndex === i &&
                        'bg-primary-50 font-medium ring-2 ring-primary-400 hover:ring-2 hover:ring-primary-400',
                    )}
                    size={'md'}
                    roundness={'xl'}
                    asChild
                  >
                    <Link href={linkOption.href}>
                      <linkOption.icon className="size-5 opacity-70 sm:size-6" />
                      <span>{linkOption.text}</span>
                    </Link>
                  </Button>
                </CarouselItem>
              );
            })}
          </CarouselContent>
        </CarouselViewport>
      </Carousel>
      {/* <div className="mt-8 h-px w-full bg-primary-50" /> */}
    </div>
  );
};
export default AccountMenuMobile;
