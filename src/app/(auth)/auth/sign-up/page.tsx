import WIP from '@/components/UI/WIP';
import { redirect } from 'next/navigation';

const SignupPage = () => {
  redirect('/auth/sign-in');
  return (
    <div>
      <WIP />
    </div>
  );
};
export default SignupPage;
