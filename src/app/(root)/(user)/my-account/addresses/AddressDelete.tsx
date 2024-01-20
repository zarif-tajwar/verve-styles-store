'use client';

import { Button } from '@/components/UI/Button';
import { deleteAddressAction } from '@/lib/actions/address';
import { AddressSelect } from '@/lib/db/schema/address';
import { TrashIcon, XMarkIcon } from '@heroicons/react/16/solid';
import * as Popover from '@radix-ui/react-popover';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { useAction } from 'next-safe-action/hooks';
import { useState } from 'react';

const AddressDelete = ({ addressId }: { addressId: AddressSelect['id'] }) => {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();
  const { execute } = useAction(deleteAddressAction, {
    onSuccess: async () => {
      await queryClient.refetchQueries({ queryKey: ['addresses'] });
    },
    onError: (errors) => {
      alert(JSON.stringify(errors));
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
          <TrashIcon className="size-4" />
        </Button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          autoFocus={false}
          onCloseAutoFocus={(e) => e.preventDefault()}
          align="end"
          side="top"
          className="rounded-xl bg-primary-0 p-4 shadow-sm ring-1 ring-primary-50"
          sideOffset={8}
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
              <TrashIcon className="size-4" />
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
