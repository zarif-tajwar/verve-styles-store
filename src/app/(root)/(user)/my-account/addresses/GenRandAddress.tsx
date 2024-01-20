'use client';

import { Button } from '@/components/UI/Button';
import { generateRandomAddressAction } from '@/lib/actions/address';
import { useQueryClient } from '@tanstack/react-query';
import { useAction } from 'next-safe-action/hooks';

const GenRandAddress = () => {
  const queryClient = useQueryClient();
  const { execute, status } = useAction(generateRandomAddressAction, {
    onSuccess: async () => {
      await queryClient.refetchQueries({ queryKey: ['addresses'] });
    },
    onError: async (errors) => {
      alert(JSON.stringify(errors));
    },
  });

  return (
    <Button
      variant={'secondary'}
      onClick={async () => {
        await execute({});
      }}
      disabled={status === 'executing'}
    >
      {status !== 'executing' && 'Generate Random Address'}
      {status === 'executing' && 'Loading...'}
    </Button>
  );
};
export default GenRandAddress;
