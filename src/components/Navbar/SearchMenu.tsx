'use client';

import { SearchIcon } from '../Svgs/icons';
import { Button } from '../UI/Button';
import { messageToast } from '../UI/Toaster';

const SearchMenu = () => {
  return (
    <div className="lg:hidden">
      <Button
        variant={'ghost'}
        onClick={() => {
          messageToast('Not implemented yet!', {
            position: 'top-center',
            duration: 1000,
          });
        }}
        size={'square'}
        className="text-primary-500"
      >
        <SearchIcon />
      </Button>
    </div>
  );
};

export default SearchMenu;
