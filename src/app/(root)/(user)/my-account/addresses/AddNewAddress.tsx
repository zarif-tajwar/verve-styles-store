'use client';

import { Button } from '@/components/UI/Button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/UI/Dialog';
import { errorToast, successToast } from '@/components/UI/Toaster';
import { addNewAddressAction } from '@/lib/actions/address';
import { ADDRESS_QUERY_KEY } from '@/lib/constants/query-keys';
import { PlusIcon } from '@heroicons/react/16/solid';
import { useQueryClient } from '@tanstack/react-query';
import { useAction } from 'next-safe-action/hooks';
import { useState } from 'react';
import AddressInputForm from './AddressInputForm';
import { DialogTitle } from '@radix-ui/react-dialog';

const AddNewAddress = () => {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();
  const { execute, status } = useAction(addNewAddressAction, {
    onSuccess: async ({ success }) => {
      await queryClient.refetchQueries({ queryKey: [ADDRESS_QUERY_KEY] });
      successToast(success);
    },
    onError: async (errors) => {
      if (errors.serverError) {
        errorToast('Failed', { description: errors.serverError });
      }
      if (errors.fetchError) {
        errorToast('Failed', { description: errors.fetchError });
      }
    },
  });

  return (
    <Dialog open={isOpen} onOpenChange={(o) => setIsOpen(o)}>
      <DialogTrigger asChild>
        <Button
          variant={'default'}
          roundness={'default'}
          className="bg-primary-500 hover:bg-primary-400"
        >
          <PlusIcon className="-ml-1 size-4" />
          Add New Address
        </Button>
      </DialogTrigger>
      <DialogContent className="p-6 sm:max-w-3xl sm:p-8">
        <div className="relative mb-8 sm:mb-10 md:mb-12">
          <DialogTitle className="mb-1 text-lg font-semibold sm:text-xl">
            Add New Address
          </DialogTitle>
          <p className="text-sm text-primary-400 sm:text-base">{`Type your address here. Click save when you're done.`}</p>
        </div>
        <AddressInputForm
          afterFormSubmit={async (values) => {
            await execute(values);
            setIsOpen(false);
          }}
        />
      </DialogContent>
    </Dialog>
  );
};

export default AddNewAddress;
