'use client';

import { Button } from '@/components/UI/Button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/UI/Dialog';
import AddressInputForm from './AddressInputForm';
import { useState } from 'react';
import { PencilSquareIcon } from '@heroicons/react/16/solid';

const EditAddress = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Dialog open={isOpen} onOpenChange={(o) => setIsOpen(o)}>
      <DialogTrigger asChild>
        <Button
          variant={'secondary'}
          size={'xs'}
          className="absolute right-0 top-0 gap-1.5"
        >
          <PencilSquareIcon className="size-4" />
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="p-8 sm:max-w-3xl">
        <AddressInputForm />
      </DialogContent>
    </Dialog>
  );
};

export default EditAddress;
