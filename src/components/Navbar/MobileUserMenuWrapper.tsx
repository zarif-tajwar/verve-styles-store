import dynamic from 'next/dynamic';

const MobileMenuLazy = dynamic(() => import('./MobileUserMenu'), {
  loading: () => (
    <div className="size-10 animate-pulse rounded-full bg-primary-100"></div>
  ),
});

const MobileUserMenuWrapper = async () => {
  return <MobileMenuLazy />;
};
export default MobileUserMenuWrapper;
