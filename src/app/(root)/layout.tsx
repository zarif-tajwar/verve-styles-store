import Footer from '@/components/Footer/Footer';
import Navbar from '@/components/Navbar/Navbar';
import { Suspense } from 'react';

export const experimental_ppr = true;

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Suspense
        fallback={<div className="h-[var(--nav-height)] animate-pulse"></div>}
      >
        <Navbar />
      </Suspense>
      {children}
      <Footer />
    </>
  );
}
