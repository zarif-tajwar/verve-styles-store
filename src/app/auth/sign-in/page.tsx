import { GoogleIcon, FacebookIcon } from '@/components/Svgs/icons';
import SignInButton from './SignInButton';
import bgImage from './sign-in-bg.jpg';
import Image from 'next/image';
import SignInFormWrapper from './SignInFormWrapper';

const SignInPage = () => {
  return (
    <div className="flex min-h-[100svh] w-screen items-center justify-center bg-primary-50 p-8">
      <main className="grid max-w-4xl grid-cols-2 gap-4 rounded-main bg-primary-0 p-4 shadow">
        <div className="overflow-hidden rounded-main shadow-inner">
          <Image
            src={bgImage}
            className="max-w-full object-cover"
            alt="Some neutral color T-shirts on a hanger."
            priority
          />
        </div>
        <div className="flex flex-col justify-center gap-8 px-8">
          <div className="flex flex-col gap-1">
            <h1 className="text-3xl font-semibold">Get inside Clothy</h1>
            <p className="text-primary-400">{`Don't keep your dream wardrobe waiting!`}</p>
          </div>
          <SignInFormWrapper />
        </div>
      </main>
    </div>
  );
};
export default SignInPage;
