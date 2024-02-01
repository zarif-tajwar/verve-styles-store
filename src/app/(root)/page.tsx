import Hero from '@/components/HomePage/Hero';
import Featured from '@/components/HomePage/Featured';
import BrowseStyle from '@/components/HomePage/BrowseStyle';
import CustomerReviews from '@/components/HomePage/CustomerReviews';

export const revalidate = 86400;
export const dynamic = 'force-static';

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
