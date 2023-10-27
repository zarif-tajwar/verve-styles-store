import FilterProductsStatusText from '@/components/ShopFilter/FilterProductsStatusText';
import { FilterSidebar } from '@/components/ShopFilter/FilterSidebar';
import SortBySelect from '@/components/ShopFilter/SortBySelect';
import React from 'react';

const ShopLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <section className="mt-16">
      <div className="container-main">
        <div className="flex justify-between gap-8">
          <FilterSidebar />
          <div className="relative flex-grow">
            <div className="mb-2 grid w-full grid-cols-2 items-end justify-end gap-4">
              {/* <FilterProductsStatusText /> */}
              <div className="col-start-2">
                <SortBySelect />
              </div>
              {children}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default ShopLayout;
