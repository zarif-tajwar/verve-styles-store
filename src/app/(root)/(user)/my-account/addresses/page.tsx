import { dedupedAuth } from '@/auth';
import { redirect } from 'next/navigation';
import AddressList from './AddressList';
import AddressConfigure from './AddressConfigure';
import ClientSessionProvider from '@/lib/provider/client-session-provider';

const AddressesPage = async () => {
  const session = await dedupedAuth();
  if (!session) {
    redirect('/auth/sign-in');
  }
  return (
    <div className="w-full">
      <div className="mb-12">
        <h1 className="text-3xl font-semibold">Address Book</h1>
      </div>
      <ClientSessionProvider session={session}>
        <div className="grid gap-12">
          <div>
            <h2 className="mb-4 text-xl font-semibold">Configure Addresses</h2>
            <AddressConfigure />
          </div>
          <div>
            <h2 className="mb-4 text-xl font-semibold">Saved Addresses</h2>
            {/* <DefaultAddressRadioGroup /> */}
            <AddressList />
          </div>
        </div>
      </ClientSessionProvider>
    </div>
  );
};
export default AddressesPage;
