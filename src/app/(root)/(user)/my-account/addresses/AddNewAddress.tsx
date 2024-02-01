'use client';

import { Button } from '@/components/UI/Button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/UI/Dialog';
import { errorToast, successToast } from '@/components/UI/Toaster';
import { addNewAddressAction } from '@/lib/actions/address';
import { PlusIcon } from '@heroicons/react/16/solid';
import { useQueryClient } from '@tanstack/react-query';
import { useAction } from 'next-safe-action/hooks';
import { useState } from 'react';
import AddressInputForm from './AddressInputForm';

const AddNewAddress = () => {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();
  const { execute, status } = useAction(addNewAddressAction, {
    onSuccess: async ({ success }) => {
      await queryClient.refetchQueries({ queryKey: ['addresses'] });
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
      <DialogContent className="p-8 sm:max-w-3xl">
        <div className="relative mb-12">
          <h2 className="mb-1 text-xl font-semibold">Add New Address</h2>
          <p className="text-primary-400">{`Type your address here. Click save when you're done.`}</p>
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
