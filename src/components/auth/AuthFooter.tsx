import LoginSimulateButton from './LoginSimulateButton';
import OauthSignInButton from './OauthSignInButton';

const AuthFooter = () => {
  return (
    <>
      <div className="relative my-8 w-full sm:my-10">
        <p className="relative z-20 mx-auto w-max bg-primary-0 px-2 text-sm font-semibold uppercase text-primary-300">
          Or
        </p>
        <div className="absolute left-0 top-1/2 z-10 h-px w-full -translate-y-1/2 bg-primary-200"></div>
      </div>
      <div className="grid gap-y-3.5">
        <OauthSignInButton provider="google" />
        <OauthSignInButton provider="facebook" />
        <LoginSimulateButton />
      </div>
    </>
  );
};
export default AuthFooter;
