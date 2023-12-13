import Breadcumb from '@/components/UI/Breadcumb';
import AccountSidebar from '@/components/account/accountSidebar';

const labels = new Map([
  ['My account', 'Account'],
  ['Login options', 'Email & Accounts'],
]);

const AccountLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="container-main flex gap-8 pt-12">
      <AccountSidebar />
      <div>
        <Breadcumb customLabels={labels} />
        {children}
      </div>
    </div>
  );
};

export default AccountLayout;
