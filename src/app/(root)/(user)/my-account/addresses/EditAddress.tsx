'use client';

import { Button } from '@/components/UI/Button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/UI/Dialog';
import AddressInputForm, { AddressInputFormProps } from './AddressInputForm';
import { useState } from 'react';
import { PencilSquareIcon } from '@heroicons/react/16/solid';
import { AddressSelect } from '@/lib/db/schema/address';
import { useSession } from 'next-auth/react';
import { editAddressAction } from '@/lib/actions/address';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAction } from 'next-safe-action/hooks';

type EditAddressProps = {
  addressData: AddressSelect;
};

const EditAddress = ({ addressData }: EditAddressProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();

  const { execute } = useAction(editAddressAction, {
    onSuccess: async () => {
      await queryClient.refetchQueries({ queryKey: ['addresses'] });
    },
    onError: (errors) => {
      alert(JSON.stringify(errors));
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
      <DialogContent className="p-8 sm:max-w-3xl">
        <div className="relative mb-12">
          <h2 className="mb-1 text-xl font-semibold">Edit Address</h2>
          <p className="text-primary-400">
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
