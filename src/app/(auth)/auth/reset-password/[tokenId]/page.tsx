import PasswordResetForm from '@/components/auth/PasswordResetForm';
import { getPasswordResetTokenInfo } from '@/lib/server/auth';
import { SearchParamsServer } from '@/lib/types/common';
import { cn } from '@/lib/util';
import { notFound } from 'next/navigation';

interface PageProps {
  params: { tokenId: string };
  searchParams: SearchParamsServer;
}

const PasswordResetTokenPage = async ({ params }: PageProps) => {
  const passwordResetTokenInfo = await getPasswordResetTokenInfo({
    tokenId: params.tokenId,
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
    <main
      className={cn(
        'relative h-[calc(100dvh-var(--screen-padding)*2)] w-full rounded-main',
        'grid',
      )}
    >
      <div className="relative flex h-full w-full flex-col items-center justify-center rounded-main bg-primary-0 shadow-sm">
        <div className="w-full max-w-sm">
          <div className="mb-16">
            <h1 className="mb-2 text-3xl font-semibold">Reset your password</h1>
            <p className="text-balance text-primary-500">
              {`Hi ${firstName}, to reset your current password, please enter your new password and continue.`}
            </p>
          </div>
          <PasswordResetForm />
        </div>
      </div>
    </main>
  );
};
export default PasswordResetTokenPage;
