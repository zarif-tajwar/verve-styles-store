import '@/app/globals.css';
import type { Metadata } from 'next';
import IntegralCF from './_fonts/integral-cf/font';
import Geist from './_fonts/geist/font';
import { Toaster } from '@/components/UI/Toaster';
import ScreenBlocker from '@/components/ScreenBlocker';
import { cn } from '@/lib/util';
import Provider from '@/lib/provider/provider';

export const metadata: Metadata = {
  title: 'Verve Styles - Cloth Store',
  description: 'Find Cloths That Matches Your Style',
  openGraph: {
    images: '/opg.jpg',
  },
  metadataBase: !!process.env.VERCEL
    ? undefined
    : new URL('http://localhost:3000'),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={cn(
          `${IntegralCF.variable} ${Geist.variable} bg-primary-0 font-geist font-normal text-primary-900 antialiased selection:bg-primary-900 selection:text-primary-50`,
          // navbar height
          'md:[--nav-height:6rem]',
          '[--nav-height:4rem]',
        )}
      >
        <Provider>
          {children}
          <Toaster />
          {/* <ScreenBlocker /> */}
        </Provider>
      </body>
    </html>
  );
}
