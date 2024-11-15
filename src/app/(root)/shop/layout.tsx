import { FilterSidebar } from '@/components/ShopFilter/FilterSidebar';
import SortBySelect from '@/components/ShopFilter/SortBySelect';
import { Container } from '@/components/UI/Container';
import { Metadata } from 'next';
import React, { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Shopping Page - Verve Styles',
  description: 'Browse and Find Your Dream Cloths!',
};

const ShopLayout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="mt-4 pb-16 lg:mt-10 lg:pb-20" data-no-sticky-nav>
      <Container className="relative h-max">
        <div className="grid gap-x-8 lg:grid-cols-[auto_1fr]">
          <Suspense fallback={<div className="h-[30rem] w-[18.5rem]"></div>}>
            <FilterSidebar />
          </Suspense>
          <div className="relative flex-grow">
            <div className="mb-2 grid w-full grid-cols-2 items-end justify-end gap-4 gap-y-5">
              <div className="col-start-2 hidden lg:block">
                <Suspense>
                  <SortBySelect />
                </Suspense>
              </div>
              {children}
            </div>
          </div>
        </div>
      </Container>
    </main>
  );
};
export default ShopLayout;
