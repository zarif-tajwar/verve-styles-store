import AccountSidebar from '@/components/account/accountSidebar';

const AccountLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="container-main flex pt-12">
      <AccountSidebar />
      {children}
    </div>
  );
};

export default AccountLayout;
