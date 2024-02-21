import AddNewAddress from './AddNewAddress';
import ChangeDefaultAddress from './ChangeDefaultAddress';
import GenRandAddress from './GenRandAddress';

const AddressPageButtons = () => {
  return (
    <div className="grid gap-2 [@media(width>=400px)]:flex">
      <AddNewAddress />
      <ChangeDefaultAddress />
      {/* <GenRandAddress /> */}
    </div>
  );
};
export default AddressPageButtons;
