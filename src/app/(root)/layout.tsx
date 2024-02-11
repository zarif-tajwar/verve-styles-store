import Navbar from '@/components/Navbar/Navbar';
import Footer from '@/components/Footer/Footer';
import Provider from '@/lib/provider/provider';
import NextTopLoader from 'nextjs-toploader';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Provider>
      <NextTopLoader
        color="#a4a4a4"
        showSpinner={false}
        shadow={false}
        height={5}
      />
      <Navbar />
      {children}
      <Footer />
    </Provider>
  );
}
