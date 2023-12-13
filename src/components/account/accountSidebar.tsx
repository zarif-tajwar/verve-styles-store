import { BookUser, FileClock, KeyRound, UserRoundCog } from 'lucide-react';
import { Button } from '../UI/Button';
import { AddressIcon } from '../Svgs/icons';
import Link from 'next/link';

const sidebarAreas = [
  {
    heading: 'Information',
    links: [
      { icon: BookUser, text: 'Addresses', href: '/my-account/addresses' },
      { icon: FileClock, text: 'Orders', href: '/my-account/orders' },
    ],
  },
  {
    heading: 'Settings',
    links: [
      {
        icon: KeyRound,
        text: 'Email & Accounts',
        href: '/my-account/addresses',
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
  return (
    <aside className="min-h-[30rem] min-w-[14rem] rounded-xl px-4 py-6 ring-1 ring-primary-50">
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
                      roundness={'lg'}
                      align={'left'}
                      className="gap-2"
                      asChild
                    >
                      <Link href={link.href}>
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
