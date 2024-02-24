import Navbar from '@/components/Navbar/Navbar';
import Footer from '@/components/Footer/Footer';
import Provider from '@/lib/provider/provider';
import NextTopLoader from 'nextjs-toploader';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Provider>
      <NextTopLoader
        // color="#a4a4a4"
        showSpinner={false}
        shadow={false}
        height={5}
        template={`<div class="bar animate-pulse from-primary-200 to-primary-300 !bg-gradient-to-r" role="bar"><div class="peg"></div></div>
        <div class="spinner" role="spinner"><div class="spinner-icon"></div></div>`}
      />
      <Navbar />
      {children}
      <Footer />
    </Provider>
  );
}
