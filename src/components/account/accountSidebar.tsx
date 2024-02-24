'use client';

import { BookUser, FileClock, KeyRound, UserRoundCog } from 'lucide-react';
import { Button } from '../UI/Button';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/util';

const sidebarAreas = [
  {
    heading: 'Information',
    links: [
      { icon: FileClock, text: 'Orders', href: '/my-account/orders' },
      { icon: BookUser, text: 'Address Book', href: '/my-account/addresses' },
    ],
  },
  {
    heading: 'Settings',
    links: [
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
    ],
  },
];

const AccountSidebar = () => {
  const pathname = usePathname();
  return (
    <aside className="top-[var(--nav-height)] border-r border-primary-50 py-8 pr-6 xl:min-w-[16rem] 2xl:pr-8 [@media(height>=460px)]:sticky">
      <div className="flex flex-col gap-8">
        {sidebarAreas.map((area) => {
          return (
            <div key={area.heading}>
              <h2 className="mb-2 font-geist text-base font-medium capitalize">
                {area.heading}
              </h2>
              <div className="flex flex-col gap-2">
                {area.links.map((link) => {
                  return (
                    <Button
                      key={link.text}
                      variant={'ghost'}
                      // variant={}

                      roundness={'lg'}
                      align={'left'}
                      className={cn(
                        'gap-2 pr-10',
                        pathname.includes(link.href) &&
                          'bg-primary-50 font-medium',
                      )}
                      asChild
                    >
                      <Link href={link.href} prefetch={false}>
                        {<link.icon width={20} height={20} strokeWidth={1.5} />}
                        {link.text}
                      </Link>
                    </Button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );
};
export default AccountSidebar;
