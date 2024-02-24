import Hero from '@/components/HomePage/Hero';
import Featured from '@/components/HomePage/Featured';
import BrowseStyle from '@/components/HomePage/BrowseStyle';
import CustomerReviews from '@/components/HomePage/CustomerReviews';
import { Metadata } from 'next';

export const revalidate = 86400;
export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Find Cloths That Matches Your Style - Verve Styles',
  description:
    'Browse through our diverse range of meticulously crafted garments, designed to bring out your individuality and cater to your sense of style.',
};

export default async function Home() {
  return (
    <main>
      <Hero />
      <Featured />
      <BrowseStyle />
      <CustomerReviews />
    </main>
  );
}
