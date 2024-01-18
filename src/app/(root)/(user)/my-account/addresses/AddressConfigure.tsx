import { Button } from '@/components/UI/Button';
import {
  PlusIcon,
  PencilSquareIcon,
  PencilIcon,
  LinkIcon,
} from '@heroicons/react/16/solid';
import AddNewAddress from './AddNewAddress';

const AddressPageButtons = () => {
  return (
    <div className="flex gap-2">
      <AddNewAddress />
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
