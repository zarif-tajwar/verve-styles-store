'use client';

import { ReactNode, useEffect } from 'react';
import ReactQueryProvider from './react-query';
import * as NProgress from 'nprogress';
import { usePathname, useRouter } from 'next/navigation';

const Provider = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();
  const router = useRouter();
  // Temp Top-loader fix

  useEffect(() => {
    NProgress.done();
  }, [pathname, router]);

  return <ReactQueryProvider>{children}</ReactQueryProvider>;
};

export default Provider;
