import { AuthHeader, AuthSection } from '@/components/auth/Common';
import SignUpCredentialsForm from '@/components/auth/SignUpCredentialsForm';
import SignUpSecondarySection from '@/components/auth/SignUpSecondarySection';
import { auth } from '@/lib/server/auth';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: `Sign Up to Verve Styles`,
  description: `Unlock your dream wardrobe today!`,
};

const SignupPage = async () => {
  const authObject = await auth();
  if (authObject.session) {
    redirect('/shop');
  }
  return (
    <AuthSection>
      <AuthHeader
        heading="Sign Up"
        description={`Unlock your dream wardrobe today!`}
      />
      <SignUpCredentialsForm />
      <SignUpSecondarySection />
    </AuthSection>
  );
};
export default SignupPage;
