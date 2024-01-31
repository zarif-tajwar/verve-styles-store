'use client';

import clsx from 'clsx';
import { Search } from '../Svgs/icons';

const SearchProduct = () => {
  return (
    <search className="relative w-full max-w-[608px]">
      <input
        type="text"
        placeholder="Search for products..."
        className={clsx(
          'peer w-full rounded-full bg-primary-50 py-3 pl-[3.25rem] pr-6 font-normal text-primary-400 outline-none transition-all duration-200',
          'placeholder:text-primary-300',
          'focus-visible:ring-2 focus-visible:ring-primary-400',
        )}
      />
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-300 transition-colors duration-200 peer-focus-visible:text-primary-400" />
    </search>
  );
};
export default SearchProduct;
