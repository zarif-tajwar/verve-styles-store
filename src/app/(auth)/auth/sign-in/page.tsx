import AuthFooter from '@/components/auth/AuthFooter';
import { AuthHeader, AuthSection } from '@/components/auth/Common';
import SignInCredentialsForm from '@/components/auth/SignInCredentialsForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: `Sign In to Verve Styles`,
  description: `Don't keep your dream wardrobe waiting. Sign In NOW!`,
};

const SignInPage = async () => {
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
