'use client';

import { Sliders } from 'lucide-react';
import { Button } from '../UI/Button';
import { messageToast } from '../UI/Toaster';

const ProductReviewMenu = () => {
  return (
    <div>
      <Button
        size={'md'}
        variant={'secondary'}
        onClick={() => messageToast('Not implemented yet!')}
        className="gap-3 text-sm"
      >
        {/* <span className="h-5 w-5"> */}
        <Sliders size={18} className="opacity-70" />
        {/* </span> */}
        Filter & Sort
      </Button>
    </div>
  );
};
export default ProductReviewMenu;
