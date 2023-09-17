import Hero from '@/components/Sections/Hero';
import Featured from '@/components/Sections/Featured';
import BrowseStyle from '@/components/Sections/BrowseStyle';
import CustomerReviews from '@/components/Sections/CustomerReviews';
import { db } from '@/lib/db';

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
