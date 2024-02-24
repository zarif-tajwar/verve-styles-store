import Breadcumb from '@/components/UI/Breadcumb';
import { Container } from '@/components/UI/Container';
import AccountMenuMobile from '@/components/account/AccountMenuMobile';
import AccountSidebar from '@/components/account/accountSidebar';

const labels = new Map([
  ['My account', 'Account'],
  ['Login options', 'Email & Accounts'],
]);

const AccountLayout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <Container className="grid gap-8 overflow-x-clip pb-16 pt-8 lg:grid-cols-[auto_1fr] lg:pb-20 xl:pt-12 2xl:gap-12">
      <div className="hidden pt-4 lg:block">
        <AccountSidebar />
      </div>
      <AccountMenuMobile />
      <div>
        <Breadcumb customLabels={labels} />
        <div className="w-full pt-3 sm:pt-4">{children}</div>
      </div>
    </Container>
  );
};

export default AccountLayout;
