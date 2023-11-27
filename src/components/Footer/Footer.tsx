import Link from 'next/link';
import Logo from '../UI/Logo';
import NewsLetterSubscription from './NewsLetterSubscription';
import { PaymentMethods, SocialMedia } from '../Svgs/icons';
import { cn } from '@/lib/util';

const Footer = () => {
  return (
    <footer className="relative mt-44">
      <div className="absolute top-0 z-auto w-full -translate-y-1/2">
        <NewsLetterSubscription />
      </div>
      <div className="bg-offwhite pb-20 pt-36">
        <div className="container-main divide-y divide-black/10">
          <nav className="mb-12 grid grid-cols-[repeat(5,auto)] justify-between gap-x-8 gap-y-16">
            <div>
              <Link href={'/'}>
                <Logo className="mb-1" />
              </Link>
              <p className="mb-9 max-w-[16rem] text-sm leading-[1.6] text-black/60">
                We have clothes that suits your style and which you’re proud to
                wear. From women to men.
              </p>
              <ul className="flex gap-3">
                {SocialMediaLinks.map((link) => (
                  <li key={link.title}>
                    <Link
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(
                        'flex aspect-square w-8 items-center justify-center rounded-full bg-white p-1.5 text-black/70 outline-none ring-1 ring-black/20',
                        'transition-all duration-150',
                        'hover:bg-black/70 hover:text-white hover:ring-black/70',
                        'focus-visible:ring-2 focus-visible:ring-black/70',
                      )}
                      aria-label={`Go to ${link.title}`}
                    >
                      <link.icon className="h-full w-full" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            {footerLinks.map((item, i) => (
              <div key={i}>
                <h4 className="mb-6 font-medium uppercase tracking-widest text-black">
                  {item.heading}
                </h4>
                <ul className="space-y-3 text-sm text-black/60">
                  {item.links.map((link, j) => (
                    <li key={j}>
                      <Link
                        href={link.href}
                        className="border-b border-b-transparent transition-all duration-100 hover:border-b-black hover:text-black"
                      >
                        {link.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
          <div className="flex items-center justify-between pt-7">
            <p className="text-sm text-black/60">
              Shop.co © 2000-2023, All Rights Reserved
            </p>
            <div className="grid grid-cols-4 gap-3">
              <span className="inline-flex items-center justify-center rounded-lg bg-white p-2.5 ring-1 ring-black/10">
                {<PaymentMethods.mastercard />}
              </span>
              <span className="inline-flex items-center justify-center rounded-lg bg-white p-2.5 ring-1 ring-black/10">
                {<PaymentMethods.paypal />}
              </span>
              <span className="inline-flex items-center justify-center rounded-lg bg-white p-2.5 ring-1 ring-black/10">
                {<PaymentMethods.applepay />}
              </span>
              <span className="inline-flex items-center justify-center rounded-lg bg-white p-2.5 ring-1 ring-black/10">
                {<PaymentMethods.gpay />}
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
export default Footer;

const SocialMediaLinks = [
  {
    title: 'Twitter',
    icon: SocialMedia.twitter,
    href: 'https://www.twitter.com/',
  },
  {
    title: 'Facebook',
    icon: SocialMedia.facebook,
    href: 'https://www.facebook.com/',
  },
  {
    title: 'Instagram',
    icon: SocialMedia.instagram,
    href: 'https://www.instagram.com/',
  },
  {
    title: 'GitHub',
    icon: SocialMedia.github,
    href: 'https://www.github.com/',
  },
];

const footerLinks = [
  {
    heading: 'Company',
    links: [
      { title: 'About', href: '/' },
      { title: 'Features', href: '/' },
      { title: 'Works', href: '/' },
      { title: 'Career', href: '/' },
    ],
  },
  {
    heading: 'Help',
    links: [
      { title: 'Customer Support', href: '/' },
      { title: 'Delivery Details', href: '/' },
      { title: 'Terms & Conditions', href: '/' },
      { title: 'Privacy Policy', href: '/' },
    ],
  },
  {
    heading: 'FAQ',
    links: [
      { title: 'Account', href: '/' },
      { title: 'Manage Deliveries', href: '/' },
      { title: 'Orders', href: '/' },
      { title: 'Payment', href: '/' },
    ],
  },
  {
    heading: 'Resources',
    links: [
      { title: 'Free eBooks', href: '/' },
      { title: 'Development Tutorial', href: '/' },
      { title: 'How to - Blog', href: '/' },
      { title: 'Youtube Playlist', href: '/' },
    ],
  },
];
