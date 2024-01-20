'use client';

import { Button } from '@/components/UI/Button';
import { errorToast, successToast } from '@/components/UI/Toaster';
import { generateRandomAddressAction } from '@/lib/actions/address';
import { useQueryClient } from '@tanstack/react-query';
import { useAction } from 'next-safe-action/hooks';
import { toast } from 'sonner';

const GenRandAddress = () => {
  const queryClient = useQueryClient();
  const { execute, status } = useAction(generateRandomAddressAction, {
    onSuccess: async () => {
      await queryClient.refetchQueries({ queryKey: ['addresses'] });
    },
    onError: async (errors) => {
      if (errors.serverError) {
        errorToast('Failed', { description: errors.serverError });
      }
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
