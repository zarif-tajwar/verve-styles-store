import { AuthHeader, AuthSection } from '@/components/auth/Common';
import GetPasswordResetLinkForm from '@/components/auth/GetPasswordResetLinkForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: `Reset Password - Verve Styles`,
  description: `Reset verve account password!`,
};

const ResetPasswordPage = async () => {
  return (
    <AuthSection>
      <AuthHeader
        className="mb-10"
        heading="Reset Your Password"
        description="Enter the email address you used to create your verve account"
      />
      <GetPasswordResetLinkForm />
    </AuthSection>
  );
};
export default ResetPasswordPage;
