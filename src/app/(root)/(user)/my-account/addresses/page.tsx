import {
  AccountHeader,
  AccountHeading,
} from '@/components/account/AccountCommon';
import { redirectIfNotSignedIn } from '@/lib/server/auth';
import AddressConfigure from './AddressConfigure';
import AddressList from './AddressList';

const AddressesPage = async () => {
  await redirectIfNotSignedIn({ redirectAfter: '/my-account/addresses' });
  return (
    <div className="w-full">
      <AccountHeader>
        <AccountHeading>Address Book</AccountHeading>
      </AccountHeader>
      <div className="grid gap-12">
        <div>
          <h2 className="mb-4 text-xl font-semibold">Configure Addresses</h2>
          <AddressConfigure />
        </div>
        <div>
          <h2 className="mb-4 text-xl font-semibold">Saved Addresses</h2>
          <AddressList />
        </div>
      </div>
    </div>
  );
};
export default AddressesPage;
