'use client';

import { Button } from '@/components/UI/Button';
import { deleteAddressAction } from '@/lib/actions/user';
import { AddressSelect } from '@/lib/db/schema/address';
import { TrashIcon, XMarkIcon } from '@heroicons/react/16/solid';
import * as Popover from '@radix-ui/react-popover';
import { useSession } from 'next-auth/react';
import { useState } from 'react';

const AddressDelete = ({ addressId }: { addressId: AddressSelect['id'] }) => {
  const [isOpen, setIsOpen] = useState(false);
  const session = useSession();
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
          <p className="mb-3 text-sm font-medium">Click delete to confirm</p>
          <div className="flex items-center gap-2">
            <Button
              variant={'destructive'}
              size={'xs'}
              className="py-1 font-medium"
              onClick={async () => {
                if (!session.data) return;
                await deleteAddressAction(addressId, session.data);
              }}
            >
              <TrashIcon className="size-4" />
              Delete
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
