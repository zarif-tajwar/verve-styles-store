import Footer from '@/components/Footer/Footer';
import Navbar from '@/components/Navbar/Navbar';

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
