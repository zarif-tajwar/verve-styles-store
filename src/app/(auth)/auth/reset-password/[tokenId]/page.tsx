import { AuthHeader, AuthSection } from '@/components/auth/Common';
import PasswordResetForm from '@/components/auth/PasswordResetForm';
import { getPasswordResetTokenInfo } from '@/lib/server/auth';
import { SearchParamsServer } from '@/lib/types/common';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

export const metadata: Metadata = {
  title: `Reset Password - Verve Styles`,
  description: `Reset verve account password!`,
};

interface PageProps {
  params: Promise<{ tokenId: string }>;
  searchParams: SearchParamsServer;
}

const PasswordResetTokenPage = async ({ params }: PageProps) => {
  const { tokenId } = await params;
  const passwordResetTokenInfo = await getPasswordResetTokenInfo({
    tokenId,
  });

  if (!passwordResetTokenInfo) {
    notFound();
  }

  if (passwordResetTokenInfo.expired) {
    return <p>expired</p>;
  }

  const data = passwordResetTokenInfo;

  const firstName = data.name?.slice(0, data.name.indexOf(' '));

  return (
    <AuthSection>
      <AuthHeader
        heading="Reset your password"
        description={`Hi ${firstName}, to reset your current password, please enter your new password and continue.`}
        className="[&_p]:text-base"
      />
      <PasswordResetForm />
    </AuthSection>
  );
};
export default PasswordResetTokenPage;
