import { AuthHeader, AuthSection } from '@/components/auth/Common';
import SignUpCredentialsForm from '@/components/auth/SignUpCredentialsForm';
import SignUpSecondarySection from '@/components/auth/SignUpSecondarySection';

const SignupPage = async () => {
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
