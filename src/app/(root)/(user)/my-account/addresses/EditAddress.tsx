'use client';

import { Button } from '@/components/UI/Button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/UI/Dialog';
import { errorToast, successToast } from '@/components/UI/Toaster';
import { editAddressAction } from '@/lib/actions/address';
import { AddressSelect } from '@/lib/db/schema/address';
import { PencilSquareIcon } from '@heroicons/react/16/solid';
import { useQueryClient } from '@tanstack/react-query';
import { useAction } from 'next-safe-action/hooks';
import { useState } from 'react';
import AddressInputForm from './AddressInputForm';

type EditAddressProps = {
  addressData: AddressSelect;
};

const EditAddress = ({ addressData }: EditAddressProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();

  const { execute } = useAction(editAddressAction, {
    onSuccess: async ({ success }) => {
      await queryClient.refetchQueries({ queryKey: ['addresses'] });
      successToast(success);
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
    <Dialog open={isOpen} onOpenChange={(o) => setIsOpen(o)}>
      <DialogTrigger asChild>
        <Button variant={'secondary'} size={'xs'} className="gap-1.5">
          <PencilSquareIcon className="size-4" />
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="p-6 sm:max-w-3xl sm:p-8">
        <div className="relative mb-8 sm:mb-10 md:mb-12">
          <h2 className="mb-1 text-xl font-semibold">Edit Address</h2>
          <p className="text-sm text-primary-400 sm:text-base">
            Make changes to your address here.
            <br />
            {`Click save changes when you're done.`}
          </p>
        </div>
        <AddressInputForm
          previousValues={{
            address: addressData.address,
            city: addressData.city,
            country: addressData.country,
            phone: addressData.phone,
            type: addressData.type,
            label: addressData.label,
          }}
          saveText="Save Changes"
          afterFormSubmit={async (values) => {
            await execute({
              newAddressValues: values,
              addressId: addressData.id,
            });
            setIsOpen(false);
          }}
        />
      </DialogContent>
    </Dialog>
  );
};

export default EditAddress;
