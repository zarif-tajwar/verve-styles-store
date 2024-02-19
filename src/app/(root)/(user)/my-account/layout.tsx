import Breadcumb from '@/components/UI/Breadcumb';
import { Button } from '@/components/UI/Button';
import { Container } from '@/components/UI/Container';
import AccountMenuMobile from '@/components/account/AccountMenuMobile';
import AccountSidebar from '@/components/account/accountSidebar';
import { ChevronRightIcon } from '@heroicons/react/20/solid';

const labels = new Map([
  ['My account', 'Account'],
  ['Login options', 'Email & Accounts'],
]);

const AccountLayout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <Container className="grid gap-8 overflow-x-clip pt-8 lg:grid-cols-[auto_1fr] xl:pt-12 2xl:gap-12">
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
