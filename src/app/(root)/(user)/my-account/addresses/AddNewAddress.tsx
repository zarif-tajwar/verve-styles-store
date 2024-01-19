'use client';

import { Button } from '@/components/UI/Button';
import {
  Dialog,
  DialogCloseBtn,
  DialogContent,
  DialogTrigger,
} from '@/components/UI/Dialog';
import AddressInputForm from './AddressInputForm';
import { useState } from 'react';
import { PlusIcon } from '@heroicons/react/16/solid';
import { addNewAddressAction } from '@/lib/actions/user';

const AddNewAddress = () => {
  const [isOpen, setIsOpen] = useState(false);
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
          <h2 className="text-xl font-semibold">Add New Address</h2>
          <p className="text-primary-400">{`Type your address here. Click save when you're done.`}</p>
        </div>
        <AddressInputForm
          afterFormSubmit={(values) => {
            addNewAddressAction(values);
            setIsOpen(false);
          }}
        />
      </DialogContent>
    </Dialog>
  );
};

export default AddNewAddress;
