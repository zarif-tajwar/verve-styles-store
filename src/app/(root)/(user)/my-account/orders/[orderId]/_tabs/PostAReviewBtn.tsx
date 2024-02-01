'use client';

import { Button } from '@/components/UI/Button';
import { messageToast } from '@/components/UI/Toaster';
import { PencilIcon } from '@heroicons/react/16/solid';

const PostAReviewBtn = () => {
  return (
    <Button
      roundness={'lg'}
      className="gap-2"
      variant={'secondary'}
      onClick={() => messageToast('Not implemented yet!')}
    >
      <PencilIcon className="size-4" />
      Post a review
    </Button>
  );
};
export default PostAReviewBtn;
