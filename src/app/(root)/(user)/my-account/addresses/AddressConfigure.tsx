import { Button } from '@/components/UI/Button';
import {
  PlusIcon,
  PencilSquareIcon,
  PencilIcon,
  LinkIcon,
} from '@heroicons/react/16/solid';
import AddNewAddress from './AddNewAddress';
import ChangeDefaultAddress from './ChangeDefaultAddress';
import GenRandAddress from './GenRandAddress';
import ToastBtn from './toastBtn';

const AddressPageButtons = () => {
  return (
    <div className="flex gap-2">
      <AddNewAddress />
      <ChangeDefaultAddress />
      <GenRandAddress />
    </div>
  );
};
export default AddressPageButtons;
