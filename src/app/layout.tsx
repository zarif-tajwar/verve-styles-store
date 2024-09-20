import '@/app/globals.css';
import { Toaster } from '@/components/UI/Toaster';
import Provider from '@/lib/provider/provider';
import { cn } from '@/lib/util';
import type { Metadata } from 'next';
import NextTopLoader from 'nextjs-toploader';
import Geist from './_fonts/geist/font';
import IntegralCF from './_fonts/integral-cf/font';

export const metadata: Metadata = {
  title: 'Verve Styles - Cloth Store',
  description: 'Find Cloths That Matches Your Style',
  openGraph: {
    images: '/opg.jpg',
  },
  metadataBase: !!process.env.VERCEL
    ? new URL(`https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`)
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
          <NextTopLoader
            showSpinner={false}
            shadow={false}
            height={5}
            template={`<div class="bar animate-pulse from-primary-200 to-primary-300 !bg-gradient-to-r" role="bar"><div class="peg"></div></div>
        <div class="spinner" role="spinner"><div class="spinner-icon"></div></div>`}
          />
          {children}
          <Toaster />
          {/* <ScreenBlocker /> */}
        </Provider>
      </body>
    </html>
  );
}
