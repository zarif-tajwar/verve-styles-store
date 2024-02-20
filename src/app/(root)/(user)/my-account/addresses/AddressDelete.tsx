'use client';

import { Button } from '@/components/UI/Button';
import { errorToast, messageToast } from '@/components/UI/Toaster';
import { deleteAddressAction } from '@/lib/actions/address';
import { AddressSelect } from '@/lib/db/schema/address';
import { cn } from '@/lib/util';
import { XMarkIcon } from '@heroicons/react/16/solid';
import * as Popover from '@radix-ui/react-popover';
import { useQueryClient } from '@tanstack/react-query';
import { Trash } from 'lucide-react';
import { useAction } from 'next-safe-action/hooks';
import { useState } from 'react';

const AddressDelete = ({ addressId }: { addressId: AddressSelect['id'] }) => {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();
  const { execute } = useAction(deleteAddressAction, {
    onSuccess: async ({ success }) => {
      await queryClient.refetchQueries({ queryKey: ['addresses'] });
      messageToast(success);
    },
    onError: (errors) => {
      if (errors.serverError) {
        errorToast('Failed', { description: errors.serverError });
      }
      if (errors.fetchError) {
        errorToast('Failed', { description: errors.fetchError });
      }
    },
  });
  return (
    <Popover.Root open={isOpen} onOpenChange={(open) => setIsOpen(open)}>
      <Popover.Trigger asChild>
        <Button
          className="size-8 p-0 data-[state=open]:cursor-default data-[state=open]:opacity-30 data-[state=open]:hover:bg-primary-50"
          variant={'secondary'}
          aria-label="Delete Address"
        >
          <Trash className="size-4" strokeWidth={2.3} />
        </Button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          autoFocus={false}
          onCloseAutoFocus={(e) => e.preventDefault()}
          align="end"
          side="top"
          className={cn(
            'origin-bottom-right rounded-xl bg-primary-0 p-4 shadow-sm ring-1 ring-primary-50',
            'data-[state=open]:animate-in data-[state=open]:fade-in data-[state=open]:zoom-in-90 data-[state=open]:slide-in-from-right-1',
            'data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=closed]:zoom-out-90 data-[state=closed]:slide-out-to-right-1',
            'ease-subtleSpring',
          )}
          sideOffset={10}
        >
          <p className="mb-3 text-sm font-medium">Click confirm to delete</p>
          <div className="flex items-center gap-2">
            <Button
              variant={'destructive'}
              size={'xs'}
              className="py-1 font-medium"
              onClick={async () => {
                await execute({ addressId });
                setIsOpen(false);
              }}
            >
              <Trash strokeWidth={2.3} className="size-4" />
              Confirm
            </Button>

            <Popover.Close asChild>
              <Button variant={'outline'} size={'xs'} className="py-1">
                <XMarkIcon className="size-4" />
                Cancel
              </Button>
            </Popover.Close>
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
};
export default AddressDelete;
