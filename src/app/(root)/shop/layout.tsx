import { FilterSidebar } from '@/components/ShopFilter/FilterSidebar';
import SortBySelect from '@/components/ShopFilter/SortBySelect';
import { Container } from '@/components/UI/Container';
import React, { Suspense } from 'react';

const ShopLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="mt-10">
      <Container>
        <div className="grid gap-x-8 lg:grid-cols-[auto_1fr]">
          <Suspense fallback={<div className="h-[30rem] w-[18.5rem]"></div>}>
            <FilterSidebar />
          </Suspense>
          <div className="relative flex-grow">
            <div className="mb-2 grid w-full grid-cols-2 items-end justify-end gap-4">
              <div className="col-start-2">
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
