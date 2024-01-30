import AddNewAddress from './AddNewAddress';
import ChangeDefaultAddress from './ChangeDefaultAddress';
import GenRandAddress from './GenRandAddress';

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
