import FilterProductsStatusText from '@/components/UI/FilterProductsStatusText';
import { FilterSidebar } from '@/components/UI/FilterSidebar';
import SortBySelect from '@/components/UI/SortBySelect';
import React from 'react';

const ShopLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <section className="mt-16">
      <div className="container-main">
        <div className="flex justify-between gap-8">
          <FilterSidebar />
          <div className="relative flex-grow">
            <div className="mb-2 flex w-full items-end justify-end gap-4">
              <FilterProductsStatusText />
              <SortBySelect />
            </div>
            {/* <div className="pb-4">
              <ShopFilterPagination />
            </div> */}
            {children}
          </div>
        </div>
      </div>
    </section>
  );
};
export default ShopLayout;
