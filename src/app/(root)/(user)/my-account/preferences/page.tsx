import WIP from '@/components/UI/WIP';
import { redirectIfNotSignedIn } from '@/lib/server/auth';

const PreferencesPage = async () => {
  await redirectIfNotSignedIn({
    redirectAfter: '/my-account',
  });
  return (
    <div>
      <WIP />
    </div>
  );
};
export default PreferencesPage;
