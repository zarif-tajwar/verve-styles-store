'use client';

import { Button } from '@/components/UI/Button';
import { generateRandomCompletedOrdersAction } from '@/lib/actions/user';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const GenRanOrderBtn = () => {
  const session = useSession();
  const router = useRouter();

  const handleClick = async () => {
    if (!session.data) return;
    await generateRandomCompletedOrdersAction(session.data.user.id, false);
    router.refresh();
  };

  return (
    <Button
      variant={'outline'}
      size={'sm'}
      className="absolute right-0 top-1/2 -translate-y-1/2 text-xs"
      onClick={handleClick}
    >
      Generate Random Orders <br /> (For Testing)
    </Button>
  );
};
export default GenRanOrderBtn;
