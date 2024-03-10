import AuthFooter from '@/components/auth/AuthFooter';
import { AuthHeader, AuthSection } from '@/components/auth/Common';
import SignInCredentialsForm from '@/components/auth/SignInCredentialsForm';
import { auth } from '@/lib/server/auth';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: `Sign In to Verve Styles`,
  description: `Don't keep your dream wardrobe waiting. Sign In NOW!`,
};

const SignInPage = async () => {
  const authObject = await auth();
  if (authObject.session) {
    redirect('/shop');
  }
  return (
    <AuthSection>
      <AuthHeader
        heading="Login"
        description={`Don't keep your dream wardrobe waiting!`}
      />
      <SignInCredentialsForm />
      <AuthFooter />
    </AuthSection>
  );
};
export default SignInPage;
