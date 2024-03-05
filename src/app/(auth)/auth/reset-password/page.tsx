import { validateRequest } from '@/lib/server/auth';
import SignOutButton from '../sign-in/SignOutButton';
import { cn } from '@/lib/util';
import GetPasswordResetLinkForm from '@/components/auth/GetPasswordResetLinkForm';

const ResetPasswordPage = async () => {
  const auth = await validateRequest();

  return (
    <main
      className={cn(
        'relative h-[calc(100dvh-var(--screen-padding)*2)] w-full rounded-main',
        // 'grid grid-cols-[1fr_1fr]',
      )}
    >
      <div className="absolute z-50">
        <p>{JSON.stringify(auth)}</p>
        <SignOutButton />
      </div>

      <div className="relative flex h-full w-full flex-col items-center justify-center rounded-main bg-primary-0 shadow-sm">
        <div className="w-full max-w-sm">
          <div className="mb-16">
            <h1 className="mb-2 text-3xl font-semibold">Reset Your Password</h1>
          </div>
          <GetPasswordResetLinkForm />
        </div>
      </div>
      {/* <div className="hidden overflow-hidden rounded-main md:block"></div> */}
    </main>
  );
};
export default ResetPasswordPage;
