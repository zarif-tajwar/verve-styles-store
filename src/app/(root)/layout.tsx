import Footer from '@/components/Footer/Footer';
import Navbar from '@/components/Navbar/Navbar';
import NextTopLoader from 'nextjs-toploader';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
