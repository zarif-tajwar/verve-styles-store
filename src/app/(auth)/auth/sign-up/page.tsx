import OauthSignInButton from '@/components/auth/OauthSignInButton';
import SignUpCredentialsForm from '@/components/auth/SignUpCredentialsForm';
import { validateRequest } from '@/lib/server/auth';
import { cn } from '@/lib/util';
import SignOutButton from '../sign-in/SignOutButton';

const SignupPage = async () => {
  const auth = await validateRequest();
  return (
    <main
      className={cn(
        'relative h-[calc(100dvh-var(--screen-padding)*2)] w-full rounded-main',
        'grid grid-cols-[1fr_1fr]',
      )}
    >
      <div className="absolute z-50">
        <p>{JSON.stringify(auth)}</p>
        <SignOutButton />
      </div>

      <div className="relative flex h-full w-full flex-col items-center justify-center rounded-main bg-primary-0 shadow-sm">
        <div className="w-full max-w-sm">
          <div className="mb-16">
            <h1 className="mb-2 text-3xl font-semibold">
              Sign Up
              <span className="text-lg font-medium text-primary-300">
                &nbsp;&nbsp;To Verve
              </span>
            </h1>
            <p className="text-lg text-primary-400">{`Don't keep your dream wardrobe waiting!`}</p>
          </div>
          <SignUpCredentialsForm />

          <div className="relative my-10 w-full">
            <p className="relative z-20 mx-auto w-max bg-primary-0 px-2 text-sm font-semibold uppercase text-primary-300">
              Or
            </p>
            <div className="absolute left-0 top-1/2 z-10 h-px w-full -translate-y-1/2 bg-primary-200"></div>
          </div>
          <div className="grid gap-y-4">
            <OauthSignInButton provider="google" />
            <OauthSignInButton provider="facebook" />
          </div>
        </div>
      </div>
      <div className="hidden overflow-hidden rounded-main md:block"></div>
    </main>
  );
};
export default SignupPage;
