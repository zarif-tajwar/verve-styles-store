'use client';

import clsx from 'clsx';
import { Search } from '../Svgs/icons';

const SearchProduct = () => {
  return (
    <div className="relative">
      <input
        type="text"
        placeholder="Search for products..."
        className={clsx(
          'peer w-full rounded-full bg-offwhite py-3 pl-[3.25rem] pr-6 font-medium text-black/70 outline-none ring-0 ring-transparent transition-all duration-200',
          'placeholder:text-black/40',
          'focus-visible:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/70',
        )}
      />
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-black/40 transition-colors duration-200 peer-focus-visible:text-black/70" />
    </div>
  );
};
export default SearchProduct;
