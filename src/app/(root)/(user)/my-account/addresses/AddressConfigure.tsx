import AddNewAddress from './AddNewAddress';
import ChangeDefaultAddress from './ChangeDefaultAddress';

const AddressPageButtons = () => {
  return (
    <div className="grid gap-2 [@media(width>=400px)]:flex">
      <AddNewAddress />
      <ChangeDefaultAddress />
    </div>
  );
};
export default AddressPageButtons;
