import Breadcumb from '@/components/UI/Breadcumb';
import AccountSidebar from '@/components/account/accountSidebar';

const labels = new Map([
  ['My account', 'Account'],
  ['Login options', 'Email & Accounts'],
]);

const AccountLayout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="container-main flex gap-12 pt-12">
      <div className="pt-4">
        <AccountSidebar />
      </div>
      <div className="flex-grow">
        <Breadcumb customLabels={labels} />
        <div className="w-full pt-4">{children}</div>
      </div>
    </div>
  );
};

export default AccountLayout;
