import Link from 'next/link';
import Logo from '../UI/Logo';
import NewsLetterSubscription from './NewsLetterSubscription';
import { PaymentMethods, SocialMedia } from '../Svgs/icons';
import { cn } from '@/lib/util';
import { Container } from '../UI/Container';

const Footer = () => {
  return (
    <footer className="relative mt-8">
      <NewsLetterSubscription />
      <div className="bg-primary-50">
        <Container className="divide-y divide-primary-100 pb-8 pt-16 sm:pb-20 sm:pt-16 md:pb-16">
          <nav className="mb-12 grid grid-cols-2 justify-between gap-x-8 gap-y-16 lg:grid-cols-[repeat(5,auto)]">
            <div className="col-span-2 lg:col-span-1">
              <Link href={'/'} className="inline-block">
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
                        'flex aspect-square w-8 items-center justify-center rounded-full bg-primary-0 text-primary-400 outline-none ring-1 ring-primary-200',
                        'transition-all duration-200',
                        'hover:bg-primary-400 hover:text-primary-0 hover:ring-primary-400',
                        'focus-visible:ring-2 focus-visible:ring-primary-400',
                      )}
                      aria-label={`Go to ${link.title}`}
                    >
                      <link.icon className="size-5" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            {footerLinks.map((item, i) => (
              <div key={i}>
                <h3 className="mb-2 font-medium uppercase tracking-widest text-primary-500 lg:mb-3">
                  {item.heading}
                </h3>
                <ul className="space-y-1.5 md:space-y-2 lg:space-y-3">
                  {item.links.map((link, j) => (
                    <li key={j}>
                      <Link
                        href={link.href}
                        className="border-b border-b-transparent text-sm text-primary-400 opacity-70 transition-all duration-100 hover:border-b-primary-400 hover:opacity-100"
                      >
                        {link.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
          <div className="flex flex-col justify-between gap-4 pt-7 sm:flex-row sm:items-center">
            <p className="text-sm text-black/60">
              {`Verves © 2023-${new Date().getFullYear()}, Developed by Zarif Tajwar`}
            </p>
            <div className="grid grid-cols-4 gap-3">
              <span className="inline-flex items-center justify-center rounded-lg bg-primary-0 p-2.5 ring-1 ring-primary-100">
                {<PaymentMethods.mastercard />}
              </span>
              <span className="inline-flex items-center justify-center rounded-lg bg-primary-0 p-2.5 ring-1 ring-primary-100">
                {<PaymentMethods.paypal />}
              </span>
              <span className="inline-flex items-center justify-center rounded-lg bg-primary-0 p-2.5 ring-1 ring-primary-100">
                {<PaymentMethods.applepay />}
              </span>
              <span className="inline-flex items-center justify-center rounded-lg bg-primary-0 p-2.5 ring-1 ring-primary-100">
                {<PaymentMethods.gpay />}
              </span>
            </div>
          </div>
        </Container>
      </div>
    </footer>
  );
};
export default Footer;

const SocialMediaLinks = [
  {
    title: 'X',
    icon: SocialMedia.x,
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
