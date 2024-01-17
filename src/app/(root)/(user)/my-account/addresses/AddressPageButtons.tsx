import { Button } from '@/components/UI/Button';
import {
  PlusIcon,
  PencilSquareIcon,
  PencilIcon,
  LinkIcon,
} from '@heroicons/react/16/solid';

const AddressPageButtons = () => {
  return (
    <div className="flex gap-2">
      <Button
        variant={'default'}
        roundness={'default'}
        className="bg-primary-500 hover:bg-primary-400"
      >
        <PlusIcon className="-ml-1 size-4" />
        Add New Address
      </Button>
      <Button
        variant={'default'}
        roundness={'default'}
        className="gap-1.5 bg-primary-500 hover:bg-primary-400"
      >
        <LinkIcon className="-ml-1 size-4" />
        Change Default Address
      </Button>
    </div>
  );
};
export default AddressPageButtons;
